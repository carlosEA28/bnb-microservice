import { describe, expect, it } from "vitest";
import { faker } from "@faker-js/faker";
import { InMemoryAuthRepository } from "./in-memory-auth-repository";

describe("InMemoryAuthRepository", () => {
  it("should return null when user is not found by id", async () => {
    const repository = new InMemoryAuthRepository();

    const user = await repository.findById(faker.string.uuid());

    expect(user).toBeNull();
  });

  it("should return null when user is not found by email", async () => {
    const repository = new InMemoryAuthRepository();

    const user = await repository.findByEmail("missing-user@email.com");

    expect(user).toBeNull();
  });
});
