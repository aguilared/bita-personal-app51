import {
  StyleSheet,
  ActivityIndicator,
  Platform,
  Image,
  Text,
} from "react-native";
import {
  Subheading,
  Surface,
  Divider,
  List,
  Appbar,
  useTheme,
} from "react-native-paper";
import HTMLView from "react-native-htmlview";
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
import { ThemedText } from "@/components/ThemedText";
import { Link } from "expo-router";
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

const { API_URL, BASE_URL_IMAGES } = Constants.expoConfig?.extra as AppConfig;
const ENDPOINT = API_URL + "bitacora/bitaevents";

const convertDate = (date: string) => {
  const d = dayjs(date).format("DD-MM-YYYY HH:MM");
  return d;
};

const BitaEvents = () => {
  const { isPending, error, data, isFetching, isLoading, refetch } = useQuery({
    queryKey: ["bitaevents"],
    queryFn: () => axios.get(`${ENDPOINT}`).then((res) => res.data),
  });
  //console.log("DATA", data);

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
  const titulo = "Bita Eventos al: " + convertDate(dates);

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
          <List.Section style={styles.containerhtml}>
            <Link href={`/bitaEvent/${item.id}`} asChild>
              <List.Item
                title={`Id:${item.id}, ${convertDate(item.event_date)}`}
                left={() => <List.Icon icon="folder" />}
              />
            </Link>

            <Image
              source={{ uri: BASE_URL_IMAGES + `${item.id}` + ".jpg" }}
              style={[
                styles.image,
                {
                  borderColor: "gray",
                },
              ]}
            />
            <ThemedText>{`TipoEvent: ${item.tipoEvent.description}`}</ThemedText>
            <ThemedText>{`Event: ${item.event.description}`}</ThemedText>
            <HTMLView
              value={`${item.description}`}
              style={styles.containerhtml}
              stylesheet={styless}
            />

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
      <BitaEvents />
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
  containerhtml: {
    marginTop: 1,
    marginBottom: 1,
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
