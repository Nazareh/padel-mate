
let handler: any;

describe('onboard-player-fn', () => {
  let putMock: jest.Mock;
  let promiseMock: jest.Mock;
  let consoleLogMock: jest.SpyInstance;
  let consoleErrorMock: jest.SpyInstance;

  beforeEach(() => {
    jest.resetModules();

    putMock = jest.fn();
    promiseMock = jest.fn();
    // Mock aws-sdk DynamoDB.DocumentClient
    jest.doMock('aws-sdk', () => ({
      DynamoDB: {
        DocumentClient: jest.fn(() => ({ put: putMock })),
      },
    }));

    handler = require('../../lambda/onboard-player-fn').handler;

    consoleLogMock = jest.spyOn(console, 'log').mockImplementation(() => { });
    consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete process.env.PLAYER_TABLE_NAME;
  });

  test('throws if PLAYER_TABLE_NAME is not set', async () => {

    const event = { userName: 'u1', request: { userAttributes: { given_name: 'A', family_name: 'B', email: 'a@b.com' } } };

    await expect(handler(event)).rejects.toThrow('PLAYER_TABLE_NAME environment variable is required');
    expect(putMock).not.toHaveBeenCalled();
  });

  test('successfully puts item into DynamoDB and logs', async () => {
    process.env.PLAYER_TABLE_NAME = 'dev-player';
    promiseMock.mockResolvedValue({});
    putMock.mockReturnValue({ promise: promiseMock });

    const event = { userName: 'u1', request: { userAttributes: { given_name: 'A', family_name: 'B', email: 'a@b.com' } } };
    await expect(handler(event)).resolves.toBeUndefined();

    expect(putMock).toHaveBeenCalledTimes(1);
    expect(putMock).toHaveBeenCalledWith({
      TableName: 'dev-player',
      Item: expect.objectContaining({
        id: 'u1',
        givenName: 'A',
        familyName: 'B',
        email: 'a@b.com',
      }),
    });

    expect(consoleLogMock).toHaveBeenCalledWith('Player added to DynamoDB', expect.objectContaining({ id: 'u1', table: 'dev-player' }));
  });

  test('propagates error when put fails', async () => {
    process.env.PLAYER_TABLE_NAME = 'dev-player';
    const err = new Error('DDB error');
    promiseMock.mockRejectedValue(err);
    putMock.mockReturnValue({ promise: promiseMock });

    const event = { userName: 'u1', request: { userAttributes: { given_name: 'A', family_name: 'B', email: 'a@b.com' } } };
    await expect(handler(event)).rejects.toThrow(err);
    expect(consoleErrorMock).toHaveBeenCalledWith('Failed to put item to DynamoDB', err);
  });
});