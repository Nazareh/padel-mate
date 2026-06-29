import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

const ssm = new SSMClient();

export async function getParameterValue(name: string): Promise<string> {
    const response = await ssm.send(
        new GetParameterCommand({
            Name: name,
            WithDecryption: true
        })
    );
    return response.Parameter!.Value!;
}