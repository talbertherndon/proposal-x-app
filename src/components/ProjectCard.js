import {
    Card,
    Divider,
    Icon,
    List,
    MenuItem,
    OverflowMenu,
    Text,
    useTheme,
} from "@ui-kitten/components";
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    Linking,
    Dimensions,
    FlatList,
    TouchableOpacity,
    Alert,
} from "react-native";
import { deleteProject, readAreas, readAreasByProjects } from "../../api";
import { useEffect, useState } from "react";
import { Image, ImageBackground } from "expo-image";
import { areas } from "../mock/areas";
import { LinearGradient } from "expo-linear-gradient";

const renderItem = ({ item }) => {
    const photo = item.source.includes("file")
        ? item.source
        : areas.find((area) => area.file === item.source);
    let requirements =
        typeof item.requirements === "string"
            ? JSON.parse(item.requirements)
            : item.requirements;

    console.log(item);
    return (
        <View style={styles.image_card_container}>
            <ImageBackground
                style={styles.image_card}
                source={!!photo?.source ? photo.source : photo}
            >
                <LinearGradient
                    colors={["transparent", "#000000"]}
                    start={{ x: 0.2, y: 0 }}
                    end={{ x: 0, y: 1.4 }}
                    style={{ height: "100%", width: "100%", padding: 5 }}
                >
                    <View style={{ margin: 5, marginTop: "auto" }}>
                        <Text numberOfLines={2}
                            ellipsizeMode="tail" category="h5" style={{ color: "white", width: '75%', flexWrap: 'wrap' }}>
                            {item.name}
                        </Text>
                        <View style={{ flexDirection: "row" }}>
                            <Text category="c1" style={{ color: "white" }}>
                                {requirements.map((requires) => requires.name).join(", ")}
                            </Text>
                        </View>
                    </View>
                </LinearGradient>
            </ImageBackground>
        </View>
    );
};

export default function ProjectCard({
    info,
    refreshProjects,
    createAttachment,
    removeProject,
    editProject,
}) {
    const theme = useTheme();
    const [areas, setAreas] = useState([]);
    const [visible, setVisible] = useState(false);

    const fullAddress = `${info.item.address}, ${info.item.city} ${info.item.state} ${info.item.zip}`;
    const url = Platform.select({
        ios: `maps:0,0?q=${fullAddress}`,
        android: `geo:0,0?q=${fullAddress}`,
    });

    const onItemSelect = async (index) => {
        if (index.row == 0) {
            //EDIT
            Alert.alert("Any changes will need a contract resign", undefined, [
                {
                    text: "Cancel",
                    onPress: () => console.log,
                },
                {
                    text: "Continue",
                    onPress: () => {
                        editProject({ ...info.item, areas: areas });
                    },
                },
            ]);
        }
        if (index.row == 1) {
            //DELTE
            Alert.alert("Are your sure you want to delete this project?", undefined, [
                {
                    text: "No",
                    onPress: () => console.log("No Pressed"),
                    style: "cancel",
                },
                {
                    text: "Yes",
                    onPress: () => removeProject(info),
                },
            ]);
        }
        if (index.row == 2) {
            //SEND
            createAttachment(info, areas);
        }

        setVisible(false);
    };

    function parseDate(dateStr) {
        const parts = dateStr.split("/");
        return new Date(parts[2], parts[0] - 1, parts[1]);
    }
    function daysUntilDue(dueDateStr) {
        if (dueDateStr) {
            const today = new Date();
            const dueDate = parseDate(dueDateStr);
            // Calculate the time difference in milliseconds
            const timeDiff = dueDate.getTime() - today.getTime();
            // Convert time difference from milliseconds to days
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
            if (daysDiff == 0) {
                return <Text style={{ color: "green" }}>Due Today</Text>;
            }
            if (daysDiff > 365) {
                return `Due Next Year`;
            }
            if (daysDiff < 0) {
                return (
                    <Text style={{ color: "red" }}>{Math.abs(daysDiff)} days past due</Text>
                );
            } else {
                return `Due in ${daysDiff} days`;
            }
        }
    }

    useEffect(() => {
        readAreasByProjects(info.item.id).then((res) => {
            setAreas(res);
        });
    }, [info]);

    return (
        <View>
            <View style={{ margin: 5, flexDirection: "column" }}>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ marginRight: "auto" }}>
                        <Text
                            category="h4"
                            style={{ fontWeight: 500 }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {info.item.name}
                        </Text>
                        <Text
                            category="s2"
                            style={{ fontWeight: 300 }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {daysUntilDue(info.item.finish)}
                        </Text>
                    </View>
                    <OverflowMenu
                        anchor={() => (
                            <TouchableOpacity
                                onPress={() => {
                                    setVisible(true);
                                }}
                            >
                                <Icon
                                    fill="#8F9BB3"
                                    style={{ width: 25, height: 25, marginLeft: "auto" }}
                                    name="menu-outline"
                                />
                            </TouchableOpacity>
                        )}
                        visible={visible}
                        onSelect={onItemSelect}
                        onBackdropPress={() => setVisible(false)}
                    >
                        <MenuItem
                            title="Edit"
                            accessoryLeft={
                                <Icon
                                    fill="#8F9BB3"
                                    style={{ width: 30, height: 30, marginLeft: "auto" }}
                                    name="edit-2-outline"
                                />
                            }
                        />
                        <MenuItem
                            title="Trash"
                            accessoryLeft={
                                <Icon
                                    fill="#8F9BB3"
                                    style={{ width: 30, height: 30, marginLeft: "auto" }}
                                    name="trash-2-outline"
                                />
                            }
                        />
                        <MenuItem
                            title="Send"
                            accessoryLeft={
                                <Icon
                                    fill="#8F9BB3"
                                    style={{ width: 30, height: 30, marginLeft: "auto" }}
                                    name="email-outline"
                                />
                            }
                        />

                        <MenuItem title="Close" onPress={() => setVisible(false)} />
                    </OverflowMenu>
                </View>
                <FlatList
                    horizontal
                    contentContainerStyle={{ alignSelf: "flex-start" }}
                    data={areas}
                    renderItem={renderItem}
                />
                <View style={{ flexDirection: "row", marginVertical: 10 }}>
                    <View
                        style={{
                            marginRight: "auto",
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <Icon
                            fill="#8F9BB3"
                            style={{ width: 20, height: 20, marginRight: 5 }}
                            name="navigation-2-outline"
                        />
                        <Text
                            category="c1"
                            style={{ fontSize: 14, width: "75%", flexWrap: "wrap" }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {fullAddress}
                        </Text>
                    </View>
                    <View
                        style={{
                            marginLeft: "auto",
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <Icon
                            fill="#8F9BB3"
                            style={{ width: 20, height: 20, marginRight: 5 }}
                            name="pricetags-outline"
                        />
                        <Text category="label">${info.item.cost.toFixed(2)}</Text>
                    </View>
                </View>
            </View>
            <Divider style={{ margin: 10 }} />
        </View>
    );
}

const styles = StyleSheet.create({
    footer: {
        padding: 10,
    },
    image_card_container: {
        marginRight: 10,
        marginVertical: 10,
    },
    image_card: {
        width: 300,
        height: 200,
        borderRadius: 10,
        overflow: "hidden",
    },
});
