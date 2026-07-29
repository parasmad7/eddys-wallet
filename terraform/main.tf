# =============================================================================
# Eddy's Wallet - Terraform Configuration
# =============================================================================
#
# This file is the entry point for Terraform. It declares which providers
# (plugins) we need, configures them with credentials, and defines the
# infrastructure resources that make up our project.
#
# Think of providers as "drivers" that let Terraform talk to a specific
# service's API. Resources are the actual things we want to create or manage.
# =============================================================================

# ---------------------------------------------------------------------------
# Terraform settings block
# ---------------------------------------------------------------------------
# The `terraform` block configures Terraform itself - not any cloud service.
# `required_providers` tells Terraform which provider plugins to download
# and what versions are acceptable. Pinning versions with `~>` means
# "allow patch updates but not minor/major" (e.g., ~> 1.9 allows 1.9.x).
# ---------------------------------------------------------------------------
terraform {
  required_version = ">= 1.0"

  required_providers {
    supabase = {
      source  = "supabase/supabase"
      version = "~> 1.9"
    }
    vercel = {
      source  = "vercel/vercel"
      version = "~> 5.5"
    }
  }
}

# ---------------------------------------------------------------------------
# Supabase provider configuration
# ---------------------------------------------------------------------------
# The provider block tells the Supabase plugin how to authenticate.
# `access_token` is your personal API token from the Supabase dashboard.
# We pass it in as a variable (defined in variables.tf) so it never gets
# hardcoded into version control.
# ---------------------------------------------------------------------------
provider "supabase" {
  access_token = var.supabase_access_token
}

# ---------------------------------------------------------------------------
# Vercel provider configuration
# ---------------------------------------------------------------------------
# Same idea - the Vercel provider needs an API token to authenticate.
# If you're on a Vercel team, you can also set the `team` argument here
# to scope all resources to that team.
# ---------------------------------------------------------------------------
provider "vercel" {
  api_token = var.vercel_api_token
}

# =============================================================================
# SUPABASE RESOURCES
# =============================================================================

# ---------------------------------------------------------------------------
# Supabase Project
# ---------------------------------------------------------------------------
# This creates a new Supabase project. A Supabase project gives you:
#   - A PostgreSQL database
#   - Auth (login/signup) service
#   - REST API (PostgREST) for your database
#   - Edge Functions runtime
#   - Storage for files
#
# The `organization_id` is the slug of your Supabase org (visible in the
# dashboard URL). The `region` determines where your database is hosted -
# pick one close to your users for lower latency.
#
# IMPORTANT: If you already have a Supabase project, you can import it
# into Terraform's state instead of creating a new one. See README.md.
# ---------------------------------------------------------------------------
resource "supabase_project" "eddys_wallet" {
  organization_id   = var.supabase_organization_id
  name              = var.project_name
  database_password = var.supabase_db_password
  region            = var.supabase_region

  # Lifecycle block: `ignore_changes` tells Terraform not to try to update
  # these fields after the initial creation. The database password can't be
  # changed via Terraform after project creation, so we prevent Terraform
  # from seeing a "drift" and trying to recreate the project.
  lifecycle {
    ignore_changes = [database_password]
  }
}

# ---------------------------------------------------------------------------
# Supabase Project Settings
# ---------------------------------------------------------------------------
# After the project is created, we can configure its services. These settings
# control how the API, auth, and database behave. We use `jsonencode()` to
# convert HCL maps into the JSON strings the provider expects.
# ---------------------------------------------------------------------------
resource "supabase_settings" "eddys_wallet" {
  project_ref = supabase_project.eddys_wallet.id

  api = jsonencode({
    db_schema = "public,storage,graphql_public"
    max_rows  = 1000
  })

  auth = jsonencode({
    site_url = var.app_url
  })
}

# =============================================================================
# VERCEL RESOURCES
# =============================================================================

# ---------------------------------------------------------------------------
# Vercel Project
# ---------------------------------------------------------------------------
# This creates a Vercel project linked to the GitHub repository. Vercel will
# automatically deploy whenever you push to the main branch. The `framework`
# tells Vercel how to build the app (we use Vite for this React project).
#
# `git_repository` connects this Vercel project to GitHub so pushes trigger
# deployments automatically - no manual deploy step needed.
# ---------------------------------------------------------------------------
resource "vercel_project" "eddys_wallet" {
  name      = var.project_name
  framework = "vite"

  git_repository = {
    type = "github"
    repo = var.github_repo
  }
}

# ---------------------------------------------------------------------------
# Environment Variables
# ---------------------------------------------------------------------------
# Vercel needs to know the Supabase URL and anon key so the frontend app
# can connect to the backend. These are set as environment variables that
# Vite picks up at build time (VITE_ prefix makes them available in the
# browser bundle).
#
# We use `vercel_project_environment_variables` (plural) to manage all
# env vars as a single resource, which keeps them in sync.
#
# `target` controls which environments get the variable:
#   - "production" = the live site (main branch deployments)
#   - "preview" = PR preview deployments
#   - "development" = local dev via `vercel dev`
#
# `sensitive = false` here because these are public client-side keys -
# the Supabase anon key is designed to be exposed in the browser. Row
# Level Security (RLS) on the database is what actually protects data.
# ---------------------------------------------------------------------------
resource "vercel_project_environment_variables" "supabase_config" {
  project_id = vercel_project.eddys_wallet.id

  variables = [
    {
      key       = "VITE_SUPABASE_URL"
      value     = "https://${supabase_project.eddys_wallet.id}.supabase.co"
      target    = ["production", "preview", "development"]
      sensitive = false
      comment   = "Supabase project URL - public, safe to expose in the browser"
    },
    {
      key       = "VITE_SUPABASE_ANON_KEY"
      value     = var.supabase_anon_key
      target    = ["production", "preview", "development"]
      sensitive = false
      comment   = "Supabase anonymous key - public, RLS protects data"
    },
  ]
}
