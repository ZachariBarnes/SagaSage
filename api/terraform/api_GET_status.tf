# # This file defines a single endpoint in the API Gateway and connects it with a lambda function

# # Defines an Endpoint for the API Gateway naming convention is "</path>"
# resource "aws_api_gateway_resource" "status" {
#   rest_api_id = aws_api_gateway_rest_api.main.id
#   parent_id   = aws_api_gateway_rest_api.main.root_resource_id
#   path_part   = "status"
# }

# # Defines an Endpoint for the API Gateway naming convention is "<HTTP Method>_</path>"
# resource "aws_api_gateway_method" "get_status" {
#   rest_api_id        = aws_api_gateway_rest_api.main.id
#   resource_id   = aws_api_gateway_resource.status.id
#   http_method   = "GET"  
#   authorization = "NONE"
# # route_key     = "GET /status"
# }

# resource "aws_api_gateway_method_response" "status" {
#   rest_api_id          = aws_api_gateway_rest_api.main.id
#   resource_id          = aws_api_gateway_resource.status.id
#   http_method          = aws_api_gateway_method.get_status.http_method
#   status_code          = 200
#   response_parameters  = {
#     "method.response.header.Access-Control-Allow-Credentials" = true
#     "method.response.header.Access-Control-Allow-Headers"     = true
#     "method.response.header.Access-Control-Allow-Methods"     = true,
#     "method.response.header.Access-Control-Allow-Origin"      = true,
#   }
#   depends_on = [aws_api_gateway_method.get_status]
# }

# # Defines an Endpoint for the API Gateway naming convention is "<HTTP Method>_</path>_integration"
# resource "aws_api_gateway_integration" "get_status_integration" {
#   #Attach to "main" API gateway configured in api_gateway.tf
#   rest_api_id             = aws_api_gateway_rest_api.main.id
#   #Connect resource to method
#   resource_id             = aws_api_gateway_resource.status.id
#   http_method             = aws_api_gateway_method.get_status.http_method
#   #Attach to Lambda configured in character_lambda_config.tf
#   uri                     = aws_lambda_function.character_lambda.invoke_arn
#   type                    = "AWS_PROXY" 
#   # #The AWS_PROXY integration type causes API gateway to call into the API of another AWS service.
#   integration_http_method = "GET"
#   passthrough_behavior    = "WHEN_NO_MATCH"
#   request_templates = {
#     "application/json" : "{\"statusCode\": 200}"
#   }
# }

# # OPTIONS integration response.
# resource "aws_api_gateway_integration_response" "get_status_integration_response" {
#   rest_api_id = aws_api_gateway_rest_api.main.id
#   resource_id = aws_api_gateway_resource.status.id
#   http_method = aws_api_gateway_method.get_status.http_method
#   status_code = 200
#   response_parameters = {
#     "method.response.header.Access-Control-Allow-Headers"     = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
#     "method.response.header.Access-Control-Allow-Methods"     = "'GET,OPTIONS,POST,PUT'",
#     "method.response.header.Access-Control-Allow-Origin"      = "'*'",
#     "method.response.header.Access-Control-Allow-Credentials" = "'true'"
#   }

#   depends_on = [aws_api_gateway_integration.get_status_integration]
# }

# module "api-gateway-enable-cors-status" {
#   source  = "squidfunk/api-gateway-enable-cors/aws"
#   version = "0.3.3"

#   api_id            = aws_api_gateway_rest_api.main.id
#   api_resource_id   = aws_api_gateway_resource.status.id
#   allow_credentials = true

#   depends_on = [aws_api_gateway_resource.status]
# }
