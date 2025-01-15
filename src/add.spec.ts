import { add } from "./add";

describe("add", () => {
  it("should add two numbers", () => {
    expect(add()).toBe(3);
  });
  describe("nest", () => {
    it("should add two numbers", () => {
      expect(add()).toBe(3);
    });
    describe("nest twice", () => {
      it("should add two numbers", () => {
        expect(add()).toBe(3);
      });
    })
  })
});