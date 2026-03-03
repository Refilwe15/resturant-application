export const swaggerSpec = {
    openapi: "3.0.0",
    info: {
        title: "Restaurant API",
        version: "1.0.0",
        description: "API documentation for Restaurant Application",
    },
    servers: [
        {
            url: "http://localhost:8000",
            description: "Local development server",
        },
    ],
    paths: {
        "/api/foods": {
            get: {
                tags: ["Foods"],
                summary: "Get all foods",
                responses: {
                    "200": {
                        description: "List of foods",
                    },
                },
            },
        },
        "/api/auth/register": {
            post: {
                tags: ["Auth"],
                summary: "Register a new user",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    name: { type: "string" },
                                    email: { type: "string" },
                                    password: { type: "string" },
                                },
                                required: ["name", "email", "password"],
                            },
                        },
                    },
                },
                responses: {
                    "201": {
                        description: "User registered successfully",
                    },
                },
            },
        },
        "/api/orders": {
            post: {
                tags: ["Orders"],
                summary: "Create an order",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    items: { type: "array" },
                                    totalPrice: { type: "number" },
                                    paymentStatus: { type: "string" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "201": {
                        description: "Order created",
                    },
                },
            },
        },
    },
};
