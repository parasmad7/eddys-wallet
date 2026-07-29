# =============================================================================
# Outputs
# =============================================================================
#
# Outputs let you extract values from your Terraform state after `terraform
# apply` finishes. They're printed to the terminal and can also be read by
# other Terraform configurations or scripts via `terraform output`.
#
# Use `terraform output` to see all values, or `terraform output <name>`
# for a specific one. Sensitive outputs are hidden by default - use
# `terraform output -json` to see them.
# =============================================================================

# ---------------------------------------------------------------------------
# Supabase outputs
# ---------------------------------------------------------------------------

output "supabase_project_id" {
  description = "The Supabase project reference ID (used in API URLs and CLI commands)"
  value       = supabase_project.eddys_wallet.id
}

output "supabase_url" {
  description = "The Supabase project URL (your app connects to this)"
  value       = "https://${supabase_project.eddys_wallet.id}.supabase.co"
}

output "supabase_api_url" {
  description = "The REST API URL for direct database queries via PostgREST"
  value       = "https://${supabase_project.eddys_wallet.id}.supabase.co/rest/v1/"
}

# ---------------------------------------------------------------------------
# Vercel outputs
# ---------------------------------------------------------------------------

output "vercel_project_id" {
  description = "The Vercel project ID (useful for CLI commands and API calls)"
  value       = vercel_project.eddys_wallet.id
}

output "vercel_project_name" {
  description = "The Vercel project name as it appears in the dashboard"
  value       = vercel_project.eddys_wallet.name
}
