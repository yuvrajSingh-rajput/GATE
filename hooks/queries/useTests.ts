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

export function useAllTestsData() {
  const { data: manifest } = useAllTests();
  return useQuery<TestData[]>({
    queryKey: ["all-tests-data"],
    queryFn: async () => {
      if (!manifest) return [];
      const promises = manifest.map((test) =>
        fetch(`/api/tests/${test.id}`).then((res) => {
          if (!res.ok) throw new Error("Failed to fetch test " + test.id);
          return res.json();
        })
      );
      return Promise.all(promises);
    },
    enabled: !!manifest && manifest.length > 0,
  });
}
