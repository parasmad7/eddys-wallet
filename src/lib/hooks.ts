import { useEffect } from 'react';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { getDataClient } from './supabase';
import { useAuth } from './auth';
import type {
  Account,
  AllowanceFrequency,
  AllowanceRule,
  Family,
  InterestConfig,
  Profile,
  SavingsGoal,
  SavingsGoalStatus,
  Transaction,
  TransactionType,
} from './types';

const PAGE_SIZE = 20;

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export function useFamily() {
  const { session, role } = useAuth();
  return useQuery({
    queryKey: ['family', session?.user.id],
    queryFn: async () => {
      const { data: profile, error: profileError } = await getDataClient()
        .from('profiles')
        .select('*')
        .eq('auth_user_id', session!.user.id)
        .single();
      if (profileError) throw profileError;
      const { data: family, error: familyError } = await getDataClient()
        .from('families')
        .select('*')
        .eq('id', profile.family_id)
        .single();
      if (familyError) throw familyError;
      return family as Family;
    },
    enabled: role === 'parent' && !!session,
  });
}

export function useProfiles(familyId?: string) {
  return useQuery({
    queryKey: ['profiles', familyId],
    queryFn: async () => {
      const { data, error } = await getDataClient()
        .from('profiles')
        .select('*')
        .eq('family_id', familyId!)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data as Profile[];
    },
    enabled: !!familyId,
  });
}

export function useAccounts(profileId?: string) {
  return useQuery({
    queryKey: ['accounts', 'profile', profileId],
    queryFn: async () => {
      const { data, error } = await getDataClient()
        .from('accounts')
        .select('*')
        .eq('profile_id', profileId!)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data as Account[];
    },
    enabled: !!profileId,
  });
}

/** All accounts across a family in one query, used for family-wide totals. */
export function useFamilyAccounts(familyId?: string) {
  return useQuery({
    queryKey: ['accounts', 'family', familyId],
    queryFn: async () => {
      const { data, error } = await getDataClient().from('accounts').select('*').eq('family_id', familyId!);
      if (error) throw error;
      return data as Account[];
    },
    enabled: !!familyId,
  });
}

export interface UseTransactionsOptions {
  limit?: number;
  type?: 'all' | TransactionType;
}

export function useTransactions(accountId?: string, options: UseTransactionsOptions = {}) {
  const { limit, type = 'all' } = options;
  return useQuery({
    queryKey: ['transactions', accountId, { limit, type }],
    queryFn: async () => {
      let query = getDataClient()
        .from('transactions')
        .select('*')
        .eq('account_id', accountId!)
        .order('created_at', { ascending: false });
      if (type !== 'all') query = query.eq('type', type);
      if (limit) query = query.limit(limit);
      const { data, error } = await query;
      if (error) throw error;
      return data as Transaction[];
    },
    enabled: !!accountId,
  });
}

/** Paginated transaction history for infinite-scroll views. */
export function useInfiniteTransactions(accountId?: string, type: 'all' | TransactionType = 'all') {
  return useInfiniteQuery({
    queryKey: ['transactions', 'infinite', accountId, type],
    queryFn: async ({ pageParam }) => {
      let query = getDataClient()
        .from('transactions')
        .select('*')
        .eq('account_id', accountId!)
        .order('created_at', { ascending: false })
        .range(pageParam, pageParam + PAGE_SIZE - 1);
      if (type !== 'all') query = query.eq('type', type);
      const { data, error } = await query;
      if (error) throw error;
      return data as Transaction[];
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => (lastPage.length < PAGE_SIZE ? undefined : allPages.length * PAGE_SIZE),
    enabled: !!accountId,
  });
}

export function useAllowanceRules(familyId?: string) {
  return useQuery({
    queryKey: ['allowanceRules', familyId],
    queryFn: async () => {
      const { data, error } = await getDataClient().from('allowance_rules').select('*').eq('family_id', familyId!);
      if (error) throw error;
      return data as AllowanceRule[];
    },
    enabled: !!familyId,
  });
}

export function useInterestConfigs(accountId?: string) {
  return useQuery({
    queryKey: ['interestConfigs', accountId],
    queryFn: async () => {
      const { data, error } = await getDataClient().from('interest_configs').select('*').eq('account_id', accountId!);
      if (error) throw error;
      return data as InterestConfig[];
    },
    enabled: !!accountId,
  });
}

export function useSavingsGoals(accountId?: string) {
  return useQuery({
    queryKey: ['savingsGoals', accountId],
    queryFn: async () => {
      const { data, error } = await getDataClient()
        .from('savings_goals')
        .select('*')
        .eq('account_id', accountId!)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data as SavingsGoal[];
    },
    enabled: !!accountId,
  });
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

function useTransact(type: 'deposit' | 'withdrawal') {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { accountId: string; amountCents: number; description?: string }) => {
      const { data, error } = await getDataClient().functions.invoke('transact', {
        body: {
          account_id: input.accountId,
          type,
          amount_cents: input.amountCents,
          description: input.description,
        },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['accounts'] });
      qc.invalidateQueries({ queryKey: ['transactions', vars.accountId] });
    },
  });
}

export function useDeposit() {
  return useTransact('deposit');
}

export function useWithdraw() {
  return useTransact('withdrawal');
}

export function useTransfer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { fromAccountId: string; toAccountId: string; amountCents: number; description?: string }) => {
      const { data, error } = await getDataClient().functions.invoke('transfer', {
        body: {
          from_account_id: input.fromAccountId,
          to_account_id: input.toAccountId,
          amount_cents: input.amountCents,
          description: input.description,
        },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['accounts'] });
      qc.invalidateQueries({ queryKey: ['transactions', vars.fromAccountId] });
      qc.invalidateQueries({ queryKey: ['transactions', vars.toAccountId] });
    },
  });
}

export function useCreateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { accountId: string; name: string; targetCents: number; targetDate?: string }) => {
      const { data, error } = await getDataClient()
        .from('savings_goals')
        .insert({
          account_id: input.accountId,
          name: input.name,
          target_amount: input.targetCents,
          target_date: input.targetDate ?? null,
        })
        .select()
        .single();
      if (error) throw error;
      return data as SavingsGoal;
    },
    onSuccess: (_data, vars) => qc.invalidateQueries({ queryKey: ['savingsGoals', vars.accountId] }),
  });
}

export function useUpdateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id: string; accountId: string; status?: SavingsGoalStatus; currentAmountCents?: number }) => {
      const patch: Record<string, unknown> = {};
      if (input.status) patch.status = input.status;
      if (input.currentAmountCents != null) patch.current_amount = input.currentAmountCents;
      const { data, error } = await getDataClient().from('savings_goals').update(patch).eq('id', input.id).select().single();
      if (error) throw error;
      return data as SavingsGoal;
    },
    onSuccess: (_data, vars) => qc.invalidateQueries({ queryKey: ['savingsGoals', vars.accountId] }),
  });
}

/** Calls the create-child Edge Function so PIN hashing stays server-side. */
export function useCreateChildProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { familyId: string; name: string; pin: string }) => {
      const { data, error } = await getDataClient().functions.invoke('create-child', {
        body: { family_id: input.familyId, name: input.name, pin: input.pin },
      });
      if (error) throw error;
      return data as Profile;
    },
    onSuccess: (_data, vars) => qc.invalidateQueries({ queryKey: ['profiles', vars.familyId] }),
  });
}

export function useCreateAllowanceRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      familyId: string;
      accountId: string;
      amountCents: number;
      frequency: AllowanceFrequency;
      dayOfWeek?: number;
      dayOfMonth?: number;
      nextRunAt: string;
    }) => {
      const { data, error } = await getDataClient()
        .from('allowance_rules')
        .insert({
          family_id: input.familyId,
          account_id: input.accountId,
          amount: input.amountCents,
          frequency: input.frequency,
          day_of_week: input.dayOfWeek ?? null,
          day_of_month: input.dayOfMonth ?? null,
          next_run_at: input.nextRunAt,
        })
        .select()
        .single();
      if (error) throw error;
      return data as AllowanceRule;
    },
    onSuccess: (_data, vars) => qc.invalidateQueries({ queryKey: ['allowanceRules', vars.familyId] }),
  });
}

export function useUpdateAllowanceRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      id: string;
      familyId: string;
      amountCents?: number;
      frequency?: AllowanceFrequency;
      dayOfWeek?: number;
      dayOfMonth?: number;
      isActive?: boolean;
    }) => {
      const patch: Record<string, unknown> = {};
      if (input.amountCents != null) patch.amount = input.amountCents;
      if (input.frequency) patch.frequency = input.frequency;
      if (input.dayOfWeek != null) patch.day_of_week = input.dayOfWeek;
      if (input.dayOfMonth != null) patch.day_of_month = input.dayOfMonth;
      if (input.isActive != null) patch.is_active = input.isActive;
      const { data, error } = await getDataClient().from('allowance_rules').update(patch).eq('id', input.id).select().single();
      if (error) throw error;
      return data as AllowanceRule;
    },
    onSuccess: (_data, vars) => qc.invalidateQueries({ queryKey: ['allowanceRules', vars.familyId] }),
  });
}

export function useUpdateInterestConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { accountId: string; annualRateBps: number; isActive?: boolean }) => {
      const { data, error } = await getDataClient()
        .from('interest_configs')
        .upsert(
          { account_id: input.accountId, annual_rate_bps: input.annualRateBps, is_active: input.isActive ?? true },
          { onConflict: 'account_id' },
        )
        .select()
        .single();
      if (error) throw error;
      return data as InterestConfig;
    },
    onSuccess: (_data, vars) => qc.invalidateQueries({ queryKey: ['interestConfigs', vars.accountId] }),
  });
}

// ---------------------------------------------------------------------------
// Real-time sync
// ---------------------------------------------------------------------------

/** Keeps React Query caches fresh by invalidating on transaction/account changes. */
export function useRealtimeSync() {
  const { role, profile, family } = useAuth();
  const qc = useQueryClient();

  useEffect(() => {
    const familyId = family?.id;
    if (!familyId) return;

    const client = getDataClient();
    const channel = client
      .channel(`sync-${familyId}-${role}-${profile?.id ?? 'all'}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        (payload: RealtimePostgresChangesPayload<{ account_id?: string }>) => {
          const record = ('account_id' in payload.new ? payload.new : payload.old) as { account_id?: string };
          const accountId = record.account_id;
          if (accountId) qc.invalidateQueries({ queryKey: ['transactions', accountId] });
          qc.invalidateQueries({ queryKey: ['transactions', 'infinite'] });
          qc.invalidateQueries({ queryKey: ['accounts'] });
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'accounts', filter: `family_id=eq.${familyId}` },
        () => {
          qc.invalidateQueries({ queryKey: ['accounts'] });
        },
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [family?.id, role, profile?.id, qc]);
}
