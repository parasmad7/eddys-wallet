# =============================================================================
# Input Variables
# =============================================================================
#
# Variables are Terraform's way of parameterizing configuration. Instead of
# hardcoding values, we declare variables here and set their values in
# terraform.tfvars (which is NOT committed to git for security).
#
# Each variable has:
#   - `description`: explains what it's for (shown in `terraform plan` prompts)
#   - `type`: the data type (string, number, bool, list, map, etc.)
#   - `default`: optional fallback value if none is provided
#   - `sensitive`: if true, Terraform hides the value in CLI output and logs
# =============================================================================

# ---------------------------------------------------------------------------
# Project-level variables
# ---------------------------------------------------------------------------

variable "project_name" {
  description = "Name for the project, used in both Supabase and Vercel"
  type        = string
  default     = "eddys-wallet"
}

variable "app_url" {
  description = "The URL where the app is hosted (used for Supabase auth redirects)"
  type        = string
  default     = "http://localhost:5173"
}

variable "github_repo" {
  description = "GitHub repository in 'owner/repo' format for Vercel to connect to"
  type        = string
  default     = "parasmad7/eddys-wallet"
}

# ---------------------------------------------------------------------------
# Supabase variables
# ---------------------------------------------------------------------------

variable "supabase_access_token" {
  description = "Personal access token for the Supabase Management API. Generate one at: https://supabase.com/dashboard/account/tokens"
  type        = string
  sensitive   = true
}

variable "supabase_organization_id" {
  description = "Supabase organization slug (found in the dashboard URL: app.supabase.com/org/<this-value>)"
  type        = string
}

variable "supabase_db_password" {
  description = "Password for the Supabase project's PostgreSQL database. Use a strong, unique password."
  type        = string
  sensitive   = true
}

variable "supabase_region" {
  description = "AWS region for the Supabase project. Pick one close to your users. Common US options: us-east-1 (Virginia), us-west-1 (California)"
  type        = string
  default     = "us-east-1"
}

variable "supabase_anon_key" {
  description = "Supabase anonymous/public key. Found in Project Settings > API. This is a public key safe to expose in the browser - RLS protects data."
  type        = string
  default     = ""
}

# ---------------------------------------------------------------------------
# Vercel variables
# ---------------------------------------------------------------------------

variable "vercel_api_token" {
  description = "API token for Vercel. Generate one at: https://vercel.com/account/tokens"
  type        = string
  sensitive   = true
}
