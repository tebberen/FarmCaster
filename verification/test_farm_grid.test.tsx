import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FarmGrid from "../components/FarmGrid";

test("renders FarmGrid", () => {
  render(<FarmGrid userStreak={0} lastActionTimestamp={0} onNetworkSelect={() => {}} activeNetworkId="base" />);
  // Check if grid elements are rendered
  const networkLabels = screen.getAllByText(/Base/i);
  expect(networkLabels.length).toBeGreaterThan(0);
});
