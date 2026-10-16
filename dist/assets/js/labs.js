// The website and executable local lab use these same example files.
export const variableFiles = {
 main: `terraform {
  required_version = ">= 1.4.0"
}

variable "greeting" {
  type = string

  validation {
    condition     = length(trimspace(var.greeting)) > 0
    error_message = "Use a non-empty greeting."
  }
}

variable "names" {
  type    = list(string)
  default = ["Terraform"]
}

locals {
  message = "\${var.greeting}, \${join(" and ", var.names)}"
}

resource "terraform_data" "message" {
  input = local.message
}

output "message" {
  value = local.message
}
`,
 values: `greeting = "Good morning"
names    = ["Terraform", "team"]
`,
 changed: `greeting = "Welcome"
names    = ["Terraform", "team"]
`
};

export const moduleMove = {
 child: `variable "message" {
  type = string
}

resource "terraform_data" "message" {
  input = var.message
}

output "message" {
  value = terraform_data.message.output
}
`,
 root: `terraform {
  required_version = ">= 1.4.0"
}

module "messages" {
  source  = "./modules/messages"
  message = "Hello, Terraform"
}

output "message" {
  value = module.messages.message
}
`,
 moved: `moved {
  from = terraform_data.message
  to   = module.messages.terraform_data.message
}
`
};
