# Terraform - Eddy's Wallet Infrastructure

Terraform is an infrastructure-as-code (IaC) tool that lets you define cloud resources in configuration files instead of clicking through dashboards. You describe _what_ you want (a Supabase project, a Vercel deployment) and Terraform figures out _how_ to create it. It tracks what it has created in a "state file" so it can update or destroy resources later. This means your infrastructure is version-controlled, reproducible, and reviewable - just like your application code.

## Prerequisites

### 1. Install Terraform

```bash
brew install terraform
```

Verify the installation:

```bash
terraform --version
```

### 2. Get API Tokens

You need two API tokens to let Terraform manage your services:

**Supabase Access Token:**
1. Go to [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens)
2. Click "Generate new token"
3. Give it a name like "terraform" and copy the token

**Supabase Organization ID:**
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click your organization name in the sidebar
3. The org slug is in the URL: `app.supabase.com/org/<this-value>`

**Vercel API Token:**
1. Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Click "Create" and give it a name like "terraform"
3. Copy the token

### 3. Configure Variables

```bash
cd terraform/
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` with your real values. This file is in `.gitignore` and should never be committed.

## Usage

All commands should be run from the `terraform/` directory.

### Initialize (first time only)

```bash
terraform init
```

This downloads the Supabase and Vercel provider plugins. You only need to run this once, or when you change provider versions. It creates a `.terraform/` directory with the downloaded plugins and a `.terraform.lock.hcl` file that locks the exact versions.

### Preview Changes

```bash
terraform plan
```

This shows what Terraform _would_ do without actually doing it. Always review this output before applying. It will show resources to be created (+), changed (~), or destroyed (-).

### Apply Changes

```bash
terraform apply
```

This creates/updates your infrastructure. Terraform will show the plan and ask for confirmation before making any changes. Type `yes` to proceed.

After a successful apply, you will see the output values (Supabase URL, Vercel project info, etc.).

### View Current State

```bash
# List all resources Terraform is managing
terraform state list

# Show details of a specific resource
terraform state show supabase_project.eddys_wallet

# See all output values
terraform output
```

### Tear Down

```bash
terraform destroy
```

This deletes all resources Terraform created. It will show what will be destroyed and ask for confirmation. Use with caution - this will delete your Supabase project and Vercel project.

## Importing an Existing Supabase Project

If you already have a Supabase project (like the current one with ref `tqmpykrqqpjjjsdxqhlm`), you can bring it under Terraform management without recreating it:

```bash
# Import the existing project into Terraform's state
terraform import supabase_project.eddys_wallet tqmpykrqqpjjjsdxqhlm

# Import its settings too
terraform import supabase_settings.eddys_wallet tqmpykrqqpjjjsdxqhlm
```

After importing, run `terraform plan` to see if the configuration matches the actual state. You may need to adjust values in `terraform.tfvars` or `main.tf` to match what already exists, so Terraform doesn't try to change anything unexpectedly.

Similarly, if you have an existing Vercel project:

```bash
# Find the project ID in the Vercel dashboard under Settings > General
terraform import vercel_project.eddys_wallet prj_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## File Structure

| File | Purpose |
|------|---------|
| `main.tf` | Provider config and resource definitions |
| `variables.tf` | Input variable declarations with descriptions |
| `outputs.tf` | Values to display after apply (URLs, IDs) |
| `terraform.tfvars.example` | Template for your secret variable values |
| `terraform.tfvars` | Your actual secret values (git-ignored) |
| `.terraform.lock.hcl` | Locked provider versions (committed) |
| `.terraform/` | Downloaded provider plugins (git-ignored) |

## Tips

- Run `terraform fmt` to auto-format your `.tf` files
- Run `terraform validate` to check for syntax errors
- Use `terraform plan -out=plan.tfplan` to save a plan and apply it exactly with `terraform apply plan.tfplan`
- State is stored locally in `terraform.tfstate` by default. For team use, consider a remote backend (like Terraform Cloud or an S3 bucket)
