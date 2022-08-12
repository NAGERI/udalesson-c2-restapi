export const config = {
  dev: {
    username: process.env.POSTGRES_USERNAME, //"postgres",
    password: process.env.POSTGRES_PASSWORD, //"postgres",
    database: process.env.POSTGRES_DATABASE, //"postgres",
    host: process.env.POSTGRES_HOST, //"postgres.caokgkyuyj6e.us-east-1.rds.amazonaws.com",
    dialect: process.env.DIALECT, //"postgres",
    aws_region: process.env.AWS_REGION, //"us-east-1",
    aws_profile: process.env.AWS_PROFILE, //"default",
    aws_media_bucket: process.env.AWS_MEDIA_BUCKET, //"my098925010127bucket",
  },
  jwt: {
    secret: " ",
  },
  prod: {
    username: process.env.POSTGRES_USERNAME_PROD,
    password: process.env.POSTGRES_PASSWORD_PROD,
    database: process.env.POSTGRES_DATABASE_PROD, //"udagram_prod",
    host: process.env.POSTGRES_HOST_PROD,
    dialect: "postgres",
  },
};
