resource "aws_lambda_function" "get_character_lambda" {
  function_name = "getCharacters"
  filename      = local.output_path
  role          = aws_iam_role.character_lambda_exec.arn
  runtime       = "nodejs18.x"
  handler       = "index.getCharacters" # <file-name>.<fucntion-name> 
  timeout       = local.lambda_timeout
  depends_on    = [aws_iam_role_policy_attachment.character_lambda_policy_attachment]
  # The below line will cause terraform to re-upload the lambda function if the source code changes
  source_code_hash = data.archive_file.character_lambda.output_base64sha256

  # Below is in case we want to start saving our build.zip files to S3 and load our lambda from there
  #   s3_bucket = aws_s3_bucket.lambda_bucket.id
  #   s3_key    = aws_s3_object.lambda_aws_api_gateway_rest_api.key

  environment {
    variables = {
      AUTH_KEY               = local.env["AUTH_KEY"],
      DOMAIN                 = local.env["DOMAIN"],
      PG_USER                = local.env["PG_USER"],
      PG_PASS                = local.env["PG_PASS"],
      PG_HOST                = local.env["PG_HOST"],
      PG_PORT                = local.env["PG_PORT"],
      PG_DATABASE            = local.env["PG_DATABASE"],
      APP_NAME               = local.env["APP_NAME"],
      SESSION_EXPIRY_SECONDS = local.env["SESSION_EXPIRY_SECONDS"],
      FIREBASE_CONFIG        = local.env["FIREBASE_CONFIG"],
      DEBUG                  = local.env["DEBUG"],
    }
  }
}

# This zips up the build folder and puts it in the same directory as the terraform file
# Zip file is built when `Terraform plan` is run
data "archive_file" "get_character_lambda" {
  type = "zip"

  source_dir  = local.source_dir
  output_path = local.output_path
}

#Grant API Gateway permission to invoke the Lambda function
# resource "aws_lambda_permission" "get_character_lambda_apigateway_permission" {
#   statement_id  = "AllowAPIGatewayInvoke"
#   action        = "lambda:InvokeFunction"
#   function_name = aws_lambda_function.get_character_lambda.function_name
#   principal     = "apigateway.amazonaws.com"
#   # source_arn = "${aws_api_gateway_rest_api.main.execution_arn}/*/*"
#   source_arn    = "arn:aws:execute-api:${local.region}:${local.account_id}:${aws_api_gateway_rest_api.main.id}/*/*"
# }

resource "aws_lambda_function_url" "get_characters_dev" {
  function_name = aws_lambda_function.get_character_lambda.function_name
  # qualifier          = "$LATEST"
  authorization_type = "NONE"
  depends_on         = [aws_lambda_function.get_character_lambda]

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["*"] #["OPTIONS", "GET", "POST"]
    allow_headers     = ["*"]
    expose_headers = [
      "keep-alive",
      "date",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Credentials",
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Methods",
      "Content-Type",
      "Set-Cookie",
      "Cookie",
      "Cookies",
      "Access-Control-Expose-Headers"
    ]
    max_age = 86400
  }
}

#Should in in output.tf
output "get_character_lambda_base_url" {
  value = "${aws_lambda_function_url.get_characters_dev.function_url}/"
}

