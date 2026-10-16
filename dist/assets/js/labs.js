// The website and executable local lab use these same example files.
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
