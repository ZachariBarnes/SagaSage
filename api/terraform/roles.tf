# IAM Role for character_lambda
resource "aws_iam_role" "character_lambda_exec" {
  name = "character_lambda"

  assume_role_policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      }
    }
  ]
}
POLICY
}

#IAM Policy attachment for character_lambda
resource "aws_iam_role_policy_attachment" "character_lambda_policy_attachment" {
  role = aws_iam_role.character_lambda_exec.name
  #This Premade service Policy grants Cloudwatch logging permissions
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

#Role for allowing API gateway to write logs to Cloudwatch
resource "aws_iam_role" "cloudwatch" {
  name               = "api_gateway_cloudwatch_global"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

#Allow Assume Role policy for API gateway to write logs to Cloudwatch
data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["apigateway.amazonaws.com"]
    }
    actions = ["sts:AssumeRole"]
  }
}

#Policy for Cloudwatch logging permissions
data "aws_iam_policy_document" "cloudwatch" {
  statement {
    effect = "Allow"
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:DescribeLogGroups",
      "logs:DescribeLogStreams",
      "logs:PutLogEvents",
      "logs:GetLogEvents",
      "logs:FilterLogEvents",
    ]
    resources = ["*"]
  }
}

#Attach cloudwatch policy to role
resource "aws_iam_role_policy" "cloudwatch" {
  name   = "default"
  role   = aws_iam_role.cloudwatch.id
  policy = data.aws_iam_policy_document.cloudwatch.json
}

#SaveLambda
# IAM Role for save_lambda
resource "aws_iam_role" "save_lambda_exec" {
  name = "save_lambda"

  assume_role_policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      }
    }
  ]
}
POLICY
}

#IAM Policy attachment for save_lambda
resource "aws_iam_role_policy_attachment" "save_lambda_policy_attachment" {
  role = aws_iam_role.save_lambda_exec.name
  #This Premade service Policy grants Cloudwatch logging permissions
  policy_arn = aws_iam_policy.save_Lambda_policy.arn
}

resource "aws_iam_policy" "save_Lambda_policy" {
  name = "save_Lambda_policy"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "s3:ListBucket",
        "s3:*Object",
        "s3:PutObjectAcl"
        //"s3:PutObject",
        //"s3:GetObject",
        //"s3:DeleteObject"
      ]
      Resource = ["arn:aws:s3:::${local.bucket_name}/*"]
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        "Resource" : "*"
      }
    ]
  })
}

output "save_role_arn" {
  value = aws_iam_role.save_lambda_exec.arn
}
