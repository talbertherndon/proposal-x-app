import {
    Button,
    ButtonGroup,
    Card,
    CheckBox,
    Divider,
    Icon,
    Input,
    Layout,
    Tab,
    TabView,
    Text,
} from "@ui-kitten/components";
import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, Keyboard, KeyboardAvoidingView, Platform, ScrollView, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, View, VirtualizedList, useWindowDimensions } from "react-native";
import { areas } from "../../mock/areas";
import { Image } from "expo-image";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CurrencyInput from 'react-native-currency-input';
import PhoneCamera from "../../app/camera";
import { useNavigation } from "@react-navigation/native";
import { Camera } from "expo-camera";



export default function NewAreaModal({ setVisible, addAreaHandler, editMode, editAreaHandler, mode }) {
    const windowHeight = Dimensions.get('window').height;
    const [selected, setSelected] = useState("Interior");
    const [selecting, setSelecting] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [name, setName] = useState('')
    const [requirements, setRequirements] = useState([])
    const [checked, setChecked] = useState([])
    const [estimate, setEstimate] = useState('');
    const [filteredRooms, setFilterRooms] = useState(areas)
    const navigation = useNavigation();
    function filterItems(filter) {
        setSelected(filter);
        setFilterRooms(areas.filter(room => room.category === filter))

    }

    function handleRoomSelect(room) {
        setSelecting(false);
        setName(room.name)
        setSelectedRoom(room);
        if (room.category === 'Interior') {
            setRequirements(["Walls", "Ceiling", "Trim", "Windows", "Doors", "Closets", "Primer", "Primer Spot", "Minor Patching, Sanding & Caulking", "Wallpaper Removal"])
        } else {
            setRequirements(["Power Wash", "Scrape/Sand", "Caulk", "Priming", "Painting", "Sealer/Stain", "Wood Repair", "Other"])

        }
    }
    function handleChecked(option) {
        const includes = !!checked.find(obj => obj.name === option)
        if (includes) {
            setChecked(checked.filter(item => item.name !== option))
        } else {
            setChecked([...checked, { name: option, coat: 1, comment: "" }])
        }
    }

    function handleUpdateCoat(option, coat) {
        setChecked(prev => prev.map(opt => opt.name === option ? { ...opt, coat: coat } : opt))
    }

    function handleUpdateComment(option, comment) {
        setChecked(prev => prev.map(opt => opt.name === option ? { ...opt, comment: comment } : opt))
    }

    async function customPhotoHandler() {
        const { status } = await Camera.requestCameraPermissionsAsync()
        console.log(status)
        if (status === 'granted') {
            navigation.navigate('Camera', { ...selectedRoom, requirements: checked, name, estimate, index: editMode?.index })
            setVisible(false)
        } else {
            Alert.alert('Access denied')
        }
    }

    useEffect(() => {
        Camera.requestCameraPermissionsAsync()

    }, [])
    useEffect(async () => {
        if (editMode) {
            handleRoomSelect(editMode)
            setChecked(typeof editMode?.requirements === 'string' ? JSON.parse(editMode.requirements) : editMode.requirements)
            setName(editMode.name)
            setEstimate(editMode.estimate)

        }


    }, [editMode])

    return (
        <Card style={{ maxHeight: windowHeight - (windowHeight / 5) }} disabled={true}>
            <KeyboardAwareScrollView enableOnAndroid={true} enableAutomaticScroll={(Platform.OS === 'ios')} extraHeight={130} extraScrollHeight={130}>
                <View style={{ width: 30, height: 30, marginLeft: "auto" }}>
                    <Icon
                        name="close-outline"
                        onPress={() => {
                            setVisible(false);
                        }}
                    />
                </View>
                <View>
                    <Text category="h5">{mode == 'edit' ? 'Edit' : 'New'} Area</Text>
                    <Text style={{ marginVertical: 10 }} category="p1">
                        Get started by filling in the information below to propose your new
                        area.
                    </Text>
                </View>
                <View>
                    {selectedRoom ?
                        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'flex-end', }}>
                            <TouchableOpacity onPress={customPhotoHandler}>
                                <Image style={{ width: 100, height: 100, borderRadius: 10 }} source={selectedRoom.source} />
                            </TouchableOpacity>
                            <View style={{ paddingHorizontal: 5 }}>
                                <Input
                                    size="large"
                                    style={{ flex: 1 }}
                                    placeholder='Bedroom #4'
                                    value={name}
                                    onChangeText={nextValue => setName(nextValue)}
                                />
                                <View style={{ flexDirection: 'row' }}>
                                    <Button onPress={customPhotoHandler} size="small">Custom Photo</Button>
                                    <Button onPress={() => { setSelecting(!selecting) }} size="small" appearance="ghost">Change Area</Button>
                                </View>
                            </View>
                        </View>

                        :
                        <Button
                            accessoryLeft={<Icon name="plus-circle-outline" />}
                            onPress={() => {
                                setSelecting(!selecting);
                                filterItems(selected)
                            }}
                        >
                            Select Room or Area
                        </Button>}
                    {selecting &&
                        <Layout>
                            <View style={{ marginVertical: 10, flexDirection: 'row' }}>
                                <ButtonGroup size="small">
                                    <Button
                                        style={{ opacity: selected == 'Interior' ? 0.5 : 1 }}
                                        onPress={() => {
                                            filterItems("Interior");
                                        }}
                                    >
                                        Interior
                                    </Button>
                                    <Button
                                        style={{ opacity: selected == 'Exterior' ? 0.5 : 1 }}
                                        onPress={() => {
                                            filterItems("Exterior");

                                        }}
                                    >
                                        Exterior
                                    </Button>
                                </ButtonGroup>

                                <Button onPress={() => setSelecting(!selecting)} size="small" style={{ marginLeft: 'auto', backgroundColor: 'red' }}>Minimize</Button>
                            </View>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={true}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingVertical: 20 }}

                            >
                                <FlatList
                                    scrollEnabled={false}
                                    contentContainerStyle={{ alignSelf: 'flex-start' }}
                                    numColumns={Math.ceil(filteredRooms.length / 2)}
                                    key={filteredRooms.length}
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={true}
                                    data={filteredRooms}
                                    renderItem={({ item }) =>
                                        <TouchableOpacity onPress={() => { handleRoomSelect(item); }} style={{ margin: 5 }}>
                                            <Image
                                                style={{ width: 150, height: 150, borderRadius: 10 }}
                                                placeholder={require('../../../assets/areas/other.png')}
                                                source={item.source}
                                                contentFit="cover"
                                            />
                                            <Text style={{ fontSize: 16, marginBottom: 10, marginTop: 5 }} >{item.name}</Text>
                                        </TouchableOpacity>
                                    }
                                    keyExtractor={item => item.name}

                                />
                            </ScrollView>
                        </Layout>
                    }
                    <Divider style={{ marginVertical: 20 }} />

                    {/* Requiements */}
                    <Text category="h6" style={{ marginVertical: 10 }}>Requirements</Text>
                    {!selectedRoom && <Text>Please Select Room.</Text>}
                    {requirements.map((requirement, i) => {
                        if (checked) {
                            const item = checked.find(obj => obj.name === requirement)
                            return (
                                <View key={i} style={{ padding: 10 }}>
                                    <CheckBox
                                        category="s2"
                                        style={{ marginVertical: 3, }}
                                        checked={!!item}
                                        onChange={() => { handleChecked(requirement, 1) }}
                                    >
                                        {requirement}
                                    </CheckBox>
                                    {!!item &&
                                        <View style={{ marginLeft: 33, marginBottom: 5 }}>
                                            {(selectedRoom.category == "Interior" && !["Minor Patching, Sanding & Caulking", "Wallpaper Removal"].includes(requirement)) || (selectedRoom.category == "Exterior" && ["Priming", "Painting", "Sealer/Stain"].includes(requirement)) ?
                                                <>
                                                    <Text category="s2">Coats:</Text>
                                                    <View style={{ flexDirection: 'row', margin: 1 }}>
                                                        <CheckBox checked={item.coat == 1} onChange={() => { item.coat == 1 ? handleUpdateCoat(requirement, 0) : handleUpdateCoat(requirement, 1) }}>One</CheckBox>
                                                        <CheckBox checked={item.coat == 2} onChange={() => { item.coat == 2 ? handleUpdateCoat(requirement, 0) : handleUpdateCoat(requirement, 2) }}>Two</CheckBox>
                                                    </View>
                                                </> : <></>}
                                            <Input style={{ marginVertical: 10 }} placeholder="Notes" value={item.comment} onChangeText={(text) => { handleUpdateComment(requirement, text) }} />
                                        </View>
                                    }

                                </View>
                            )
                        }
                    })}

                    {/* Estimate */}
                    <Text category="h6" style={{ marginVertical: 10, marginTop: 15 }}>Estimate</Text>
                    <CurrencyInput
                        style={{ marginTop: 5, fontSize: 25, borderColor: 'black', borderWidth: 1, padding: 5, borderRadius: 5, borderColor: 'grey' }}
                        value={estimate}
                        onChangeValue={setEstimate}
                        label="Estmate"
                        placeholder="$0.00"
                        prefix="$"
                        delimiter=","
                        separator="."
                        precision={2}

                    />


                </View>
                <View style={{ flexDirection: 'row', marginLeft: 'auto', marginTop: 25 }}>
                    <Button onPress={() => { setVisible(false); setSelecting(false); }} appearance="ghost">
                        Cancel
                    </Button>
                    <Button onPress={() => { if (name && selectedRoom && estimate) { mode == 'edit' ? editAreaHandler({ ...selectedRoom, requirements: checked, name, estimate, index: editMode.index }) : addAreaHandler({ ...selectedRoom, requirements: checked, name, estimate }) } }} >
                        {mode == 'edit' ? 'Edit' : 'Create'}
                    </Button>
                </View>
            </KeyboardAwareScrollView>
        </Card>
    );
}
