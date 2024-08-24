import React from "react";
import AppFunctional from "./AppFunctional";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"; // Ensure this is imported

describe("It is the First Test", () => {
  beforeEach(() => {
    render(<AppFunctional />);
  });

  test("sanity", () => {
    expect(screen.getByText("You moved 0 times")).toBeInTheDocument();
  });
});
