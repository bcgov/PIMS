export const createMockHeader = () => ({
  headers: {
    "Access-Control-Allow-Origin": "*",
    Authorization: "mockToken",
  },
});

export const ERROR = { message: "Errors", status: 400 };
