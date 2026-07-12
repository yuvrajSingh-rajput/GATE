import { useQuery } from "@tanstack/react-query";
import { TestMeta, TestData } from "@/types";

export function useAllTests() {
  return useQuery<TestMeta[]>({
    queryKey: ["tests"],
    queryFn: async () => {
      const res = await fetch("/api/tests");
      if (!res.ok) throw new Error("Failed to fetch tests");
      return res.json();
    },
  });
}

export function useTest(testId: string) {
  return useQuery<TestData>({
    queryKey: ["test", testId],
    queryFn: async () => {
      const res = await fetch(`/api/tests/${testId}`);
      if (!res.ok) throw new Error("Failed to fetch test data");
      return res.json();
    },
    enabled: !!testId,
  });
}
