import { Platform, ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Input,
  Layout,
  Text,
  Modal,
  List,
  ListItem,
} from "@ui-kitten/components";
import { useEffect, useState } from "react";
import NewAreaModal from "../modals/NewAreaModal";
import { Image } from "expo-image";
import { useNavigation, useRoute } from "@react-navigation/native";
import { areas } from "../../mock/areas";
import { deleteArea } from "../../../api";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function JobInformation({ setJobInformation, jobInformation }) {
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState("new");
  const [editMode, setEditMode] = useState();
  const route = useRoute();

  useEffect(() => {
    if (route.params?.file) {
      console.log("CAMERS PARASM ADTE NAVI:", route.params);
      setMode("camera");
      setEditMode(route.params);
      setVisible(true);
    }
  }, [route.params?.file]);

  function addAreaHandler(room) {

    console.log(room);
    setJobInformation([room, ...jobInformation]);
    setVisible(false);
    
  }

  function editAreaHandler(room) {
    const newItems = [...jobInformation];
    newItems[room.index] = room;
    setJobInformation(newItems);
    setVisible(false);
  }
  function deleteAreaHandler(item, index) {
    const newItems = [...jobInformation];
    newItems.splice(index, 1);
    setJobInformation(newItems);
    if (item?.id) {
      deleteArea(item.id)
    }
  }

  const renderItem = ({ item, index }) => {
    let requirements = typeof item.requirements === 'string' ? JSON.parse(item.requirements) : item.requirements;
    let photo = typeof item.source === 'string' ? item?.source.includes('file') ? item.source : areas.find((area) => area.file === item.source) : areas.find((area) => area.file === item.file);

    return (
      <>
        <ListItem
          onPress={() => {
            setEditMode({ ...item, index });
            setVisible(true);
            setMode("edit");
          }}
          accessoryRight={(props) => (
            <Button
              disabled={item.id ? true : false}
              onPress={() => {
                deleteAreaHandler(item, index)
              }}
              size="tiny"
            >
              Delete
            </Button>
          )}
          accessoryLeft={(props) => (
            <Image
              style={{ width: 75, height: 75, borderRadius: 5 }}
              source={!!photo?.source ? photo.source : photo}
            />
          )}
          title={(props) => (
            <Text
              style={{ marginHorizontal: 10, fontSize: 18, fontWeight: 500 }}
            >
              {item.name}
            </Text>
          )}
          description={(des) => (
            <View style={{ marginHorizontal: 10 }}>
              <Text category="c1">
                {requirements.map((requires) => requires.name).join(", ")}
              </Text>
              <Text category="c2">${item.estimate.toFixed(2)}</Text>
            </View>
          )}
        />
      </>
    );
  };

  return (
    <KeyboardAwareScrollView enableOnAndroid={true} enableAutomaticScroll={(Platform.OS === 'ios')}>
      <Layout style={styles.container}>
        <Text category="h5" style={{ marginBottom: 10 }}>
          Area Details
        </Text>
        <Text category="p1" style={{ marginBottom: 10 }}>
          Please choose all areas where work is required for the clients
          project.
        </Text>
        <Button
          onPress={() => {
            setVisible(true);
            setEditMode();
            setMode("add");
          }}
          style={{ marginRight: "auto" }}
        >
          Add Areas
        </Button>

        {visible &&
          <Modal
            visible={visible}
            backdropStyle={styles.backdrop}
            onBackdropPress={() => setVisible(false)}
          >
            <NewAreaModal
              mode={mode}
              setVisible={setVisible}
              addAreaHandler={addAreaHandler}
              editAreaHandler={editAreaHandler}
              editMode={editMode}
            />
          </Modal>}

        <List
          style={{ marginBottom: 'auto' }}
          data={jobInformation}
          renderItem={renderItem}
        />
      </Layout>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  input: {
    marginTop: 10,
  },
  shadow: {
    shadowColor: "#171717",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 30,
  },
  bottomTab: {
    backgroundColor: "white",
    height: 75,
    width: "100%",
    padding: 16,
  },
});
