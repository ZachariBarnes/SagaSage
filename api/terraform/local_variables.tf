locals {
  account_id     = data.aws_caller_identity.current.account_id
  source_dir     = "../${path.module}/build"
  output_path    = "../${path.module}/build.zip"
  env            = { for tuple in regexall("(.*)=(.*)", file("../.env")) : tuple[0] => replace(tuple[1], "\r", "") }
  lambda_timeout = 900 # in seconds Max 900(15 minutes)
  bucket_name    = local.env["S3_IMAGE_BUCKET"]
  region         = local.env["REGION"]
  acl_value      = "public"
}

data "aws_caller_identity" "current" {}
