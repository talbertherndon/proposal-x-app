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
import { FlatList, Keyboard, KeyboardAvoidingView, Platform, ScrollView, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, View, VirtualizedList } from "react-native";
import { areas } from "../../mock/areas";
import { Image } from "expo-image";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CurrencyInput from 'react-native-currency-input';
import PhoneCamera from "../PhoneCamera";



export default function NewAreaModal({ setVisible, addAreaHandler, editMode, editAreaHandler }) {

    const [selected, setSelected] = useState("Interior");
    const [selecting, setSelecting] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(editMode ? editMode : null);
    const [name, setName] = useState(editMode ? editMode.name : '')
    const [requirements, setRequirements] = useState([])
    const [checked, setChecked] = useState([])
    const [estimate, setEstimate] = useState(editMode ? editMode.estimate : '');

    function handleRoomSelect(room) {
        setSelecting(false);
        setName(room.name)
        setSelectedRoom(room);
        if (room.category === 'Interior') {
            setRequirements(["Walls", "Ceiling", "Trim", "Windows", "Doors", "Closets", "Primer", "Minor Patching & Sanding", "Wallpaper Removal"])
        } else {
            setRequirements(["Power Wash", "Scrape/Sand", "Caulk", "Priming", "Painting", "Sealer/Staom", "Wood Repair", "Other"])

        }
    }
    function handleChecked(option) {
        if (checked.includes(option)) {
            setChecked(checked.filter(item => item !== option))
        } else {
            setChecked([...checked, option])
        }
    }

    function customPhotoHandler() {

    }

    useEffect(() => {
        if (editMode) {
            handleRoomSelect(editMode)
        }
    }, [editMode])

    return (
        <Card disabled={true}>
            <KeyboardAwareScrollView>
                <View style={{ width: 30, height: 30, marginLeft: "auto" }}>
                    <Icon
                        name="close-outline"
                        onPress={() => {
                            setVisible(false);
                        }}
                    />
                </View>
                <View>
                    <Text category="h5">{editMode ? 'Edit' : 'New'} Area</Text>
                    <Text style={{ marginVertical: 10 }} category="body">
                        Get started by filling in the information below to propose your new
                        area.
                    </Text>
                </View>
                <View>
                    {selectedRoom ?
                        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'flex-end', }}>
                            <Image style={{ width: 100, height: 100, borderRadius: 10 }} source={selectedRoom.source} />
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
                            }}
                        >
                            Select Room or Area
                        </Button>}
                    {selecting &&
                        <Layout>
                            <View style={{ marginVertical: 10, flexDirection: 'row' }}>
                                <ButtonGroup>
                                    <Button
                                        style={{ opacity: selected == 'Interior' ? 0.5 : 1 }}
                                        onPress={() => {
                                            setSelected("Interior");
                                        }}
                                    >
                                        Interior
                                    </Button>
                                    <Button
                                        style={{ opacity: selected == 'Exterior' ? 0.5 : 1 }}
                                        onPress={() => {
                                            setSelected("Exterior");
                                        }}
                                    >
                                        Exterior
                                    </Button>
                                </ButtonGroup>

                                <Button onPress={() => setSelecting(!selecting)} size="small" style={{ marginLeft: 'auto', backgroundColor: 'red' }}>Minimize</Button>
                            </View>
                            <FlatList
                                style={{ maxHeight: 450 }}
                                data={areas}
                                renderItem={({ item }) =>
                                    item.category == selected ? (
                                        <TouchableOpacity onPress={() => { handleRoomSelect(item); console.log("SOURCE:", item.source) }} style={{ flex: 1, margin: 5 }}>
                                            <Image
                                                style={{ width: "auto", height: 175, borderRadius: 10 }}
                                                placeholder={require('../../../assets/areas/other.png')}
                                                source={item.source}
                                                contentFit="cover"
                                            />
                                            <Text style={{ fontSize: 16, marginBottom: 10, marginTop: 5 }} >{item.name}</Text>
                                        </TouchableOpacity>
                                    ) : null
                                }
                                numColumns={2}
                                keyExtractor={item => item.name}

                            />
                        </Layout>
                    }
                    <Divider style={{ marginVertical: 20 }} />

                    {/* Requiements */}
                    <Text category="h6" style={{ marginVertical: 10 }}>Requiements</Text>
                    {requirements.map((requirement) => {
                        const state = checked.includes(requirement)
                        return (
                            <>
                                <CheckBox
                                    style={{ marginVertical: 3 }}
                                    checked={state}
                                    onChange={() => { handleChecked(requirement) }}
                                >
                                    {requirement}
                                </CheckBox>

                            </>
                        )
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
                    <Button onPress={() => { if (name && selectedRoom && estimate) { editMode ? editAreaHandler({ ...selectedRoom, requirements: checked, name, estimate }) : addAreaHandler({ ...selectedRoom, requirements: checked, name, estimate }) } }} >
                        {editMode ? 'Edit' : 'Create'}
                    </Button>
                </View>
            </KeyboardAwareScrollView>
        </Card>
    );
}
