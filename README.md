[![Node.js CI](https://github.com/Salo7a/My-Tickets-Market/actions/workflows/node.yml/badge.svg)](https://github.com/Salo7a/My-Tickets-Market/actions/workflows/node.yml)
# E-Commerce App For Event Tickets

Made Using NodeJS Microservices & NextJS

To run the app, make sure you have Kubernetes, Skaffold & Ingress-nginx installed, and that you have added your domain,
currently set to `tickets.dev`, to the ingress service file `./infra/k8s/ingress-srv.yaml`, and redirected it to
`127.0.0.1` in case of local development, then run the `skaffold dev` command in th root of the repo.

To deploy the Kubernetes cluster, you have to create a jwt Secret in Kubernetes using the following command,
replacing YOUR_SECRET with your desired jwt secret:

`kubectl create secret generic jwt-secret --from-literal=JWT_KEY=YOUR_SECRET`

And your Stripe private key

`kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=YOUR_STRIPE_SECRET_KEY`

And add your Stripe publishable key in `./client/src/config/stripe-key`
