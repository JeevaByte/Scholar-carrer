import type { AddressInfo } from "node:net";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "./app.js";

describe("API routes", () => {
  const userId = "route-test-user";
  let server: ReturnType<typeof app.listen>;
  let baseUrl = "";

  beforeAll(async () => {
    server = app.listen(0);
    await new Promise<void>((resolve) => {
      server.on("listening", () => resolve());
    });
    const address = server.address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  });

  it("returns a request-scoped profile", async () => {
    const response = await fetch(`${baseUrl}/api/v1/profile`, {
      headers: { "x-user-id": userId }
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      id: userId,
      fullName: "Alex Johnson"
    });
  });

  it("persists saved opportunities and dashboard state for a request user", async () => {
    const opportunitiesResponse = await fetch(`${baseUrl}/api/v1/opportunities`);
    const opportunities = (await opportunitiesResponse.json()) as { items: Array<{ id: string }> };

    const targetId = opportunities.items[0]?.id;
    expect(targetId).toBeTruthy();

    const saveResponse = await fetch(`${baseUrl}/api/v1/saved`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-user-id": userId
      },
      body: JSON.stringify({ opportunityId: targetId })
    });
    expect(saveResponse.status).toBe(201);

    const dashboardResponse = await fetch(`${baseUrl}/api/v1/dashboard`, {
      headers: { "x-user-id": userId }
    });
    const dashboard = (await dashboardResponse.json()) as {
      recommended: Array<{ id: string }>;
    };

    expect(dashboard.recommended.some((item) => item.id === targetId)).toBe(true);
  });

  it("rejects invalid save payloads with a validation error", async () => {
    const response = await fetch(`${baseUrl}/api/v1/saved`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-user-id": userId
      },
      body: JSON.stringify({ opportunityId: "" })
    });

    expect(response.status).toBe(400);
  });
});
