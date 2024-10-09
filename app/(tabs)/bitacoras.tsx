import { StyleSheet, ActivityIndicator, Platform, Image } from "react-native";
import {
  Subheading,
  Surface,
  Divider,
  List,
  Appbar,
  useTheme,
} from "react-native-paper";
import axios from "axios";
import dayjs from "dayjs";
import React, { useState, useRef, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import {
  useQuery,
  focusManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { FlashList } from "@shopify/flash-list";
import Constants from "expo-constants";
import { AppConfig } from "../../app.config";
const { API_URL, BASE_URL_IMAGES } = Constants.expoConfig?.extra as AppConfig;
const ENDPOINT = API_URL + "bitacora";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: true,
      staleTime: 10000,
    },
  },
});

const convertDate = (date: string) => {
  const d = dayjs(date).format("DD-MM-YYYY HH:MM");
  return d;
};

const Bitacoras = () => {
  const { isPending, error, data, isFetching, isLoading, refetch } = useQuery({
    queryKey: ["bitacoras"],
    queryFn: () => axios.get(`${ENDPOINT}`).then((res) => res.data),
  });

  const enabledRef = useRef(false);
  useFocusEffect(
    useCallback(() => {
      if (enabledRef.current) {
        refetch();
      } else {
        enabledRef.current = true;
      }
    }, [refetch])
  );
  const dates: any = new Date();
  const titulo = "Bitacoras al: " + convertDate(dates);
  const navigation = useNavigation();

  if (isLoading) {
    return <ActivityIndicator size="large" color="#e91e63" />;
  }

  return (
    <Surface style={styles.container}>
      <Subheading style={styles.title}>{titulo}</Subheading>
      <Divider style={{ backgroundColor: "gray", marginTop: 10 }} />
      <FlashList
        data={data}
        renderItem={({ item }) => (
          <List.Section>
            <List.Item
              onPress={() =>
                navigation.navigate("ModalBitacoraId", {
                  id: item.id,
                  author_id: item.author_id,
                  bitacora_date: item.bitacora_date,
                  eventos: item._count.bita_events,
                })
              }
              title={`Id:${item.id}, Events:${item._count.bita_events}`}
              left={() => <List.Icon icon="folder" />}
            />
            <List.Item title={`Date:${convertDate(item.bitacora_date)}`} />
            <List.Item title={`Author:${item.author.name}`} />
            <Divider style={{ backgroundColor: "gray", marginTop: 30 }} />
          </List.Section>
        )}
        estimatedItemSize={200}
        keyExtractor={(item, index) => index.toString()}
      />
    </Surface>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Bitacoras />
    </QueryClientProvider>
  );
}
const styles = StyleSheet.create({
  header: {
    backgroundColor: "#D5DBDB",
    height: 30,
    fontSize: 18,
  },
  a: {
    fontWeight: "bold",
    color: "purple",
  },
  div: {
    fontFamily: "monospace",
    marginTop: 1,
    marginBottom: 1,
  },
  p: {
    fontSize: 38,
  },
  container: {
    flex: 1,
    marginTop: 31,
    backgroundColor: "#fff",
    marginRight: 3,
    marginLeft: 3,
  },
  title: {
    marginTop: 5,
    marginBottom: 1,
    paddingVertical: 5,
    marginLeft: 5,
    marginRight: 5,
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
    backgroundColor: "#0F7694",
    borderRadius: 3,
  },
  title11: {
    marginTop: 1,
    marginBottom: 1,
    paddingVertical: 5,
    marginLeft: 5,
    fontSize: 19,
    fontWeight: "bold",
  },
  title1: {
    marginTop: 1,
    marginBottom: 1,
    marginLeft: 1,
    marginRight: 5,
    fontSize: 17,
  },
  title3: {
    marginTop: 1,
    marginBottom: 1,
    marginLeft: 10,
    marginRight: 5,
    paddingVertical: 5,
    fontSize: 17,
    color: "blue",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  label: {
    paddingVertical: 5,
    marginLeft: 3,
    fontSize: 16,
    fontWeight: "bold",
    color: "gray",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#f0f6fa",
    borderRadius: 4,
    fontSize: 16,
    height: 18,
    padding: 5,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 1,
    marginBottom: 1,
  },
  inputMulti: {
    backgroundColor: "#f0f6fa",
    borderRadius: 4,
    fontSize: 14,
    padding: 5,
    marginLeft: 3,
    marginRight: 3,
  },
  image: {
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 10,
    borderRadius: 20,
    width: "100%",
    height: 340,
  },
});

const styless = StyleSheet.create({
  a: {
    fontWeight: "300",
    color: "#FF3366", // make links coloured pink
    fontSize: 18,
  },
  p: {
    fontWeight: "300",
    fontSize: 18,
  },
});
