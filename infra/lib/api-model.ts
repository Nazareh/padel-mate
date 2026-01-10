import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";

export const postMatchModel = (scope: Construct, api: apigateway.RestApi, stackName:String ): apigateway.Model => {
    return new apigateway.Model(scope, `${stackName}-model-validator`, {
        restApi: api,
        contentType: "application/json",
        description: "Validate PostMatch request body",
        modelName: `${stackName}-postMatch`.replace(/-/g, ""),
        schema: {
            type: apigateway.JsonSchemaType.OBJECT,
            required: ["startTime", "team1Player1", "team1Player2", "team2Player1", "team2Player2", "scores"],
            properties: {
                startTime: { type: apigateway.JsonSchemaType.STRING },
                team1Player1: { type: apigateway.JsonSchemaType.STRING },
                team1Player2: { type: apigateway.JsonSchemaType.STRING },
                team2Player1: { type: apigateway.JsonSchemaType.STRING },
                team2Player2: { type: apigateway.JsonSchemaType.STRING },
                scores: {
                    type: apigateway.JsonSchemaType.ARRAY,
                    items: {
                        type: apigateway.JsonSchemaType.OBJECT,
                        required: ["team1", "team2"],
                        properties: {
                            team1: { type: apigateway.JsonSchemaType.INTEGER },
                            team2: { type: apigateway.JsonSchemaType.INTEGER }
                        }
                    }
                }
            },
        },
    });
}

