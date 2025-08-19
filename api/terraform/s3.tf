resource "aws_s3_bucket" "image_gen_bucket" {
  bucket = local.bucket_name
}

resource "aws_s3_bucket_acl" "bucket_acl" {
  bucket = aws_s3_bucket.image_gen_bucket.id
  acl    = "public-read"
}
