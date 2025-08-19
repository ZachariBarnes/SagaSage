# # This file defines a single endpoint in the API Gateway and connects it with a lambda function

# # Defines an Endpoint for the API Gateway naming convention is "</path>"
# resource "aws_api_gateway_resource" "character" {
#   rest_api_id = aws_api_gateway_rest_api.main.id
#   parent_id   = aws_api_gateway_rest_api.main.root_resource_id
#   path_part   = "character"
# }

# # Defines an Endpoint for the API Gateway naming convention is "<HTTP Method>_</path>"
# resource "aws_api_gateway_method" "get_character" {
#   rest_api_id   = aws_api_gateway_rest_api.main.id
#   resource_id   = aws_api_gateway_resource.character.id
#   http_method   = "POST"  
#   authorization = "NONE"
#   api_key_required = false
# # route_key     = "POST /character"
# }

# resource "aws_api_gateway_method_response" "character" {
#   rest_api_id          = aws_api_gateway_rest_api.main.id
#   resource_id          = aws_api_gateway_resource.character.id
#   http_method          = aws_api_gateway_method.get_character.http_method
#   status_code          = 200
#   response_parameters  = {
#     "method.response.header.Access-Control-Allow-Credentials" = true
#     "method.response.header.Access-Control-Allow-Headers"     = true
#     "method.response.header.Access-Control-Allow-Methods"     = true,
#     "method.response.header.Access-Control-Allow-Origin"      = true,
#   }
#   depends_on = [aws_api_gateway_method.get_character]
# }

# # Defines an Endpoint for the API Gateway naming convention is "<HTTP Method>_</path>_integration"
# resource "aws_api_gateway_integration" "post_character_integration" {
#   #Attach to "main" API gateway configured in api_gateway.tf
#   rest_api_id             = aws_api_gateway_rest_api.main.id
#   #Connect resource to method
#   resource_id             = aws_api_gateway_resource.character.id
#   http_method             = aws_api_gateway_method.get_character.http_method
#   #Attach to Lambda configured in character_lambda_config.tf
#   uri                     = aws_lambda_function.character_lambda.invoke_arn
#   type                    = "AWS_PROXY" 
#   # #The AWS_PROXY integration type causes API gateway to call into the API of another AWS service.
#   integration_http_method = "POST"
#   passthrough_behavior    = "WHEN_NO_MATCH"
#   request_templates = {
#     "application/json" : "{\"statusCode\": 200}"
#   }
  
# }

# # OPTIONS integration response.
# resource "aws_api_gateway_integration_response" "post_character_integration_response" {
#   rest_api_id = aws_api_gateway_rest_api.main.id
#   resource_id = aws_api_gateway_resource.character.id
#   http_method = aws_api_gateway_method.get_character.http_method
#   status_code = 200
#   response_parameters = {
#     "method.response.header.Access-Control-Allow-Headers"     = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
#     "method.response.header.Access-Control-Allow-Methods"     = "'GET,OPTIONS,POST,PUT'",
#     "method.response.header.Access-Control-Allow-Origin"      = "'*'",
#     "method.response.header.Access-Control-Allow-Credentials" = "'true'"
#   }

#   depends_on = [aws_api_gateway_integration.post_character_integration]
# }

# # CORS
# module "api-gateway-enable-cors-character" {
#   source  = "squidfunk/api-gateway-enable-cors/aws"
#   version = "0.3.3"

#   api_id            = aws_api_gateway_rest_api.main.id
#   api_resource_id   = aws_api_gateway_resource.character.id
#   allow_credentials = true

#   depends_on = [aws_api_gateway_resource.character]
# }


# # resource "aws_api_gateway_method" "cors_method" {
# #   rest_api_id   = aws_api_gateway_rest_api.main.id
# #   resource_id   = aws_api_gateway_resource.character.id
# #   http_method   = "OPTIONS"
# #   authorization = "NONE"
# # }

# # resource "aws_api_gateway_method_response" "cors_method_response" {
# #   rest_api_id = aws_api_gateway_rest_api.main.id
# #   resource_id = aws_api_gateway_resource.character.id
# #   http_method = aws_api_gateway_method.cors_method.http_method
# #   # -------------------------------------------------------------------------
# #   # 3. Changed `status_code` value from `string` to `int` ("200" -> `200`)
# #   # ------------------------------------------------------------------------- 
# #   status_code = 200 

# #   response_models = {
# #     "application/json" = "Empty"
# #   }

# #   response_parameters = {
# #   # -------------------------------------------------------------------------
# #   # 4. Added Access-Control-Allow-Credentials
# #   #    calls with `Authorization` header fail without this
# #   # ------------------------------------------------------------------------- 
# #     "method.response.header.Access-Control-Allow-Credentials" = true,
# #     "method.response.header.Access-Control-Allow-Headers" = true
# #     "method.response.header.Access-Control-Allow-Methods" = true,
# #     "method.response.header.Access-Control-Allow-Origin"  = true,
# #   }

# #   depends_on = [aws_api_gateway_method.cors_method]
# # }

# # resource "aws_api_gateway_integration" "cors_integration" {
# #   rest_api_id = aws_api_gateway_rest_api.main.id
# #   resource_id = aws_api_gateway_resource.character.id
# #   http_method = aws_api_gateway_method.cors_method.http_method

# #   type = "MOCK"

# #   # -------------------------------------------------------------------------
# #   # 5. Added `request_templates`
# #   # ------------------------------------------------------------------------- 
# #   request_templates = {
# #     "application/json" = "{ \"statusCode\": 200 }"
# #   }

# #   depends_on = [aws_api_gateway_method.cors_method]
# # }

# # resource "aws_api_gateway_integration_response" "cors_integration_response" {
# #   rest_api_id = aws_api_gateway_rest_api.main.id
# #   resource_id = aws_api_gateway_resource.character.id
# #   http_method = aws_api_gateway_method.cors_method.http_method
# #   status_code = aws_api_gateway_method_response.cors_method_response.status_code

# #   # careful with double/single quotes here
# #   response_parameters = {
# #   # -------------------------------------------------------------------------
# #   # 6. Added Access-Control-Allow-Credentials
# #   #    calls with `Authorization` header fail without this
# #   # ------------------------------------------------------------------------- 
# #     "method.response.header.Access-Control-Allow-Credentials" = "'true'"
# #   # -------------------------------------------------------------------------
# #   # 7. Simplified `Access-Control-Allow-Headers` to `Authorization,Content-Type` for methods with 
# #   #    `COGNITO_USER_POOLS` authorization and `Content-Type` only for methods without authorization
# #   # ------------------------------------------------------------------------- 
# #     "method.response.header.Access-Control-Allow-Headers" = "'Authorization,Content-Type'" 
# #     "method.response.header.Access-Control-Allow-Methods" = "'OPTIONS,POST'",
# #     "method.response.header.Access-Control-Allow-Origin"  = "'${join(",", ["http://localhost:3000"])}'",
# #   }

# #   depends_on = [aws_api_gateway_method_response.cors_method_response]
# # }
