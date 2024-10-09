import { Link } from "expo-router";
import {
  StyleSheet,
  ActivityIndicator,
  Platform,
  Image,
  Text,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { AppConfig } from "../../app.config";
import {
  useQuery,
  focusManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import Constants from "expo-constants";
import axios from "axios";
import {
  Subheading,
  Surface,
  Divider,
  List,
  Appbar,
  useTheme,
} from "react-native-paper";
import { FlashList } from "@shopify/flash-list";
import { ThemedText } from "@/components/ThemedText";
import HTMLView from "react-native-htmlview";
import dayjs from "dayjs";

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

const BitaEvent = () => {
  const { bitaevent } = useLocalSearchParams();

  useEffect(() => {
    if (bitaevent) {
      //getGameDetails(bitaevent).then(setGameInfo);
      console.log("bitaevent", bitaevent);
    }
  }, [bitaevent]);

  const { API_URL, BASE_URL_IMAGES } = Constants.expoConfig?.extra as AppConfig;
  const ENDPOINT = API_URL + "bitacora/event_id/" + bitaevent;

  const convertDate = (date: string) => {
    const d = dayjs(date).format("DD-MM-YYYY HH:MM");
    return d;
  };
  const titulo = "Bita-Evento: " + bitaevent;

  const { isPending, error, data, isFetching, isLoading, refetch } = useQuery({
    queryKey: ["bitaevent"],
    queryFn: () => axios.get(`${ENDPOINT}`).then((res) => res.data),
  });

  console.log("DATA", data);
  if (isLoading) {
    return <ActivityIndicator size="large" color="#e91e63" />;
  }

  return (
    <Surface style={styles.container}>
      <Subheading style={styles.title}>{titulo}</Subheading>
      <Divider style={{ backgroundColor: "gray", marginTop: 10 }} />
      <List.Section style={styles.containerhtml}>
        <Image
          source={{ uri: BASE_URL_IMAGES + `${data.id}` + ".jpg" }}
          style={[
            styles.image,
            {
              borderColor: "gray",
            },
          ]}
        />
        <ThemedText>{`Date: ${convertDate(data.event_date)}`}</ThemedText>
        <ThemedText>{`TipoEvent: ${data.tipoEvent.description}`}</ThemedText>
        <ThemedText>{`Event: ${data.event.description}`}</ThemedText>
        <HTMLView
          value={`${data.description}`}
          style={styles.containerhtml}
          stylesheet={styless}
        />
      </List.Section>
    </Surface>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BitaEvent />
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
