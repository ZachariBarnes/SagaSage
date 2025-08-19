# #Create new API Gateway named "main"
# resource "aws_api_gateway_rest_api" "main" {
#   name = "character_lambda_api"
# }

# #Create deployment for API Gateway "main"
# resource "aws_api_gateway_deployment" "dev" {
#   rest_api_id = aws_api_gateway_rest_api.main.id

#   triggers = {
#     redeployment = sha1(jsonencode(aws_api_gateway_rest_api.main.body))
#   }

#   lifecycle {
#     create_before_destroy = true
#   }
#   depends_on    = [aws_api_gateway_integration.get_status_integration]
# }

# #Create stage "dev" for API Gateway "main"
# resource "aws_api_gateway_stage" "dev" {
#   rest_api_id  = aws_api_gateway_rest_api.main.id
#   deployment_id = aws_api_gateway_deployment.dev.id
#   stage_name  = "dev"
#   depends_on    = [aws_api_gateway_rest_api.main, aws_api_gateway_integration.get_status_integration]
# }

# //Logging Permission setup

# resource "aws_api_gateway_account" "main" {
#   cloudwatch_role_arn = aws_iam_role.cloudwatch.arn
# }

# resource "aws_api_gateway_method_settings" "main_settings" {
#   rest_api_id = aws_api_gateway_rest_api.main.id
#   stage_name  = aws_api_gateway_stage.dev.stage_name
#   method_path = "*/*"

#   settings {
#     logging_level = "INFO"
#     data_trace_enabled = true
#     metrics_enabled = true
#   }
# }
# //End Logging

