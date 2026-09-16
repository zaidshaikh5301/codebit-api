import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Codebit API",
      version: "1.0.0",
      description: "API for the Codebit developer collaboration platform",
    },

    servers: [
      {
        url: "https://codebit-api.onrender.com",
        description: "Production server",
      },
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", enum: [false] },
            error: {
              type: "object",
              properties: {
                code: { type: "string" },
                message: { type: "string" },
                details: { type: "array" },
                requestId: { type: "string" },
              },
              required: ["code", "message"],
            },
          },
          required: ["success", "error"],
        },

        ValidationErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", enum: [false] },
            error: {
              type: "object",
              properties: {
                code: { type: "string", enum: ["VALIDATION_ERROR"] },
                message: { type: "string" },
                details: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      field: { type: "string" },
                      message: { type: "string" },
                    },
                  },
                },
                requestId: { type: "string" },
              },
              required: ["code", "message", "details"],
            },
          },
          required: ["success", "error"],
        },

        UnauthorizedResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", enum: [false] },
            error: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                  enum: [
                    "AUTH_REQUIRED",
                    "INVALID_TOKEN",
                    "TOKEN_EXPIRED",
                  ],
                },
                message: { type: "string" },
                requestId: { type: "string" },
              },
              required: ["code", "message"],
            },
          },
          required: ["success", "error"],
        },

        ForbiddenResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", enum: [false] },
            error: {
              type: "object",
              properties: {
                code: { type: "string", enum: ["FORBIDDEN"] },
                message: { type: "string" },
                requestId: { type: "string" },
              },
              required: ["code", "message"],
            },
          },
          required: ["success", "error"],
        },

        NotFoundResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", enum: [false] },
            error: {
              type: "object",
              properties: {
                code: { type: "string", enum: ["NOT_FOUND"] },
                message: { type: "string" },
                requestId: { type: "string" },
              },
              required: ["code", "message"],
            },
          },
          required: ["success", "error"],
        },

        ConflictResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", enum: [false] },
            error: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                  enum: ["CONFLICT", "DUPLICATE_RESOURCE"],
                },
                message: { type: "string" },
                requestId: { type: "string" },
              },
              required: ["code", "message"],
            },
          },
          required: ["success", "error"],
        },

        RateLimitedResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", enum: [false] },
            error: {
              type: "object",
              properties: {
                code: { type: "string", enum: ["RATE_LIMITED"] },
                message: { type: "string" },
                requestId: { type: "string" },
              },
              required: ["code", "message"],
            },
          },
          required: ["success", "error"],
        },

        InternalErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", enum: [false] },
            error: {
              type: "object",
              properties: {
                code: { type: "string", enum: ["INTERNAL_ERROR"] },
                message: { type: "string" },
                requestId: { type: "string" },
              },
              required: ["code", "message"],
            },
          },
          required: ["success", "error"],
        },

        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", enum: [true] },
            message: { type: "string" },
            data: { type: "object" },
            pagination: { type: "object" },
          },
          required: ["success", "message"],
        },
      },
    },
  },

  apis: ["./src/**/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);