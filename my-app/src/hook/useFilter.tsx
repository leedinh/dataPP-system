import { useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import useQuery from "./useQuery";

export type ClearUrlParams = (config?: { ignoreParams?: string[] }) => void;

interface UseFilterProps {
  topic?: string;
}

export const propsDefault: UseFilterProps = {
  topic: "topic",
};

export const getQuery = (query: URLSearchParams, name: string) => {
  if (query?.has(name)) return query.get(name);
  return "";
};

export default function useFilter(options?: UseFilterProps) {
  options = { ...propsDefault, ...options };
  const { pathname } = useLocation();
  const query = useQuery();
  const navigate = useNavigate();

  const getQueryParam = useCallback(
    (key?: string) => {
      if (!key) return "";
      if (!query.has(key)) return "";
      return query.get(key);
    },
    [query]
  );

  const aggregateQuery = (key: string, value: any) => {
    if (query.has(key)) {
      if (value) {
        query.set(key, Array.isArray(value) ? value.join(",") : value);
      } else {
        query.delete(key);
      }
    } else {
      query.append(key, value);
    }
  };

  const pushQuery = (key: string, value: any) => {
    aggregateQuery(key, value);
    navigate({ search: query.toString() });
  };

  const pushQueries = (q: Record<string, any>) => {
    Object.entries(q).forEach(([key, value]) => {
      aggregateQuery(key, value);
    });
    navigate({ search: query.toString() });
  };

  const pushGroupQuery = (groups: Record<string, string[]>) => {
    Object.entries(groups).forEach(([key, values]) => {
      pushQuery(key, values);
    });
  };

  const popQueries = (keys: string[]) => {
    if (!keys?.length) return;
    keys.forEach((k) => {
      if (query.has(k)) {
        query.delete(k);
      }
    });

    navigate({ search: query.toString() });
  };

  const clearQuery = ({ exceptionList = [] }: { exceptionList: string[] }) => {
    const arr = query.keys();
    for (const key of arr) {
      if (!exceptionList.includes(key)) {
        query.delete(key);
      }
    }
    const search = query.toString();
    navigate({ search });
  };

  return {
    pushQueries,
    pushQuery,
    popQueries,
    pushGroupQuery,
    clearQuery,
    getQueryParam,
    topic: getQueryParam(options.topic) || "-1",
    dataset: getQueryParam("dataset"),
    pathname,
  };
}
