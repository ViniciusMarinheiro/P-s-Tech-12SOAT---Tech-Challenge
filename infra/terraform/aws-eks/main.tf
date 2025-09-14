resource "aws_eks_cluster" "my_cluster" {
  name     = "my-eks-cluster"
  role_arn = aws_iam_role.eks_master_role.arn

  vpc_config {
    subnet_ids = [
      aws_subnet.eks_subnet_public_1.id,
      aws_subnet.eks_subnet_public_2.id
    ]
  }
}

resource "aws_eks_fargate_profile" "my_fargate_profile" {
  cluster_name           = aws_eks_cluster.my_cluster.name
  fargate_profile_name   = "my-fargate-profile"
  pod_execution_role_arn = aws_iam_role.eks_master_role.arn
  subnet_ids             = [
    aws_subnet.eks_subnet_public_1.id,
    aws_subnet.eks_subnet_public_2.id
  ]

  selector {
    namespace = "default"
    labels = {
      app = "oficina-api"
    }
  }

  selector {
    namespace = "default"
    labels = {
      app = "postgres"
    }
  }

  selector {
    namespace = "default"
    labels = {
      app = "redis"
    }
  }
}