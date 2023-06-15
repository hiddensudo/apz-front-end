import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Button from "@mui/material/Button";
import {useTranslation} from "react-i18next";
import LanguageSelector from "../header/LanguageSelector";

const AdminPage = () => {
    const {t} = useTranslation();

    const [activeTab, setActiveTab] = useState('user');
    const [users, setUsers] = useState([]);
    const [editedName, setEditedName] = useState('');
    const [editedEmail, setEditedEmail] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);


    const [newFirstName, setNewFirstName] = useState('');
    const [newLastName, setNewLastName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        const isAdminLoggedIn = !!localStorage.getItem('admin_access'); // Перевірка наявності admin_access

        if (!isAdminLoggedIn) {
            // Перенаправлення користувача на сторінку входу
            window.location.href = '/login';
        }
    }, []);

    const handleAddUser = () => {
        const firstName = newFirstName.trim();
        const lastName = newLastName.trim();
        const email = newEmail.trim();
        const password = newPassword.trim();

        if (!firstName || !lastName || !email || !password) {
            alert('First name, last name, email and password cannot be empty');
            return;
        }

        axios
            .post(`http://127.0.0.1:5000/api/user/register`, {
                first_name: firstName,
                last_name: lastName,
                email: email,
                password: password,
            })
            .then((response) => {
                console.log(response.data.message);
                setUsers([
                    ...users,
                    {
                        id: response.data.id,
                        first_name: firstName,
                        last_name: lastName,
                        email: email,
                    },
                ]);
            })
            .catch((error) => {
                console.log(error);
            });

        setNewFirstName('');
        setNewLastName('');
        setNewEmail('');
        setNewPassword('');
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        if (activeTab === 'user') {
            axios
                .get('http://127.0.0.1:5000/api/user/get_all')
                .then((response) => {
                    setUsers(
                        response.data.map((user) => ({
                            id: user._id.$oid,
                            first_name: user.first_name,
                            last_name: user.last_name,
                            email: user.email,
                        }))
                    );
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [activeTab]);

    const updateUser = (userId) => {
        const user = users.find((user) => user.id === userId);
        if (!user) return;

        const updatedName = user.first_name.trim();
        const updatedSurname = user.last_name.trim();
        const updatedEmail = user.email.trim();

        if (!updatedName || !updatedEmail) {
            alert('Name and email cannot be empty');
            return;
        }

        axios
            .put(`http://127.0.0.1:5000/api/user/update_name_by_id/${userId}`, {
                first_name: updatedName,
                last_name: updatedSurname,
                email: updatedEmail,
            })
            .then((response) => {
                console.log(response.data.message);
            })
            .catch((error) => {
                console.log(error);
            });
    };


    const handleEdit = (userId, name, surname, email) => {
        setSelectedUser({
            id: userId,
            name: name,
            surname: surname,
            email: email,
        });
    };

    const deleteUser = (userId) => {
        axios
            .delete(`http://127.0.0.1:5000/api/user/delete_account_by_id/${userId}`)
            .then((response) => {
                console.log(response.data.message);
                setUsers(users.filter((user) => user.id !== userId));
            })
            .catch((error) => {
                console.log(error);
            });
    };


    const handleNameChange = (e, userId) => {
        const updatedName = e.target.value;
        setUsers(
            users.map((user) => {
                if (user.id === userId) {
                    return {...user, first_name: updatedName};
                }
                return user;
            })
        );
    };

    const handleSurnameChange = (e, userId) => {
        const updatedSurname = e.target.value;
        setUsers(
            users.map((user) => {
                if (user.id === userId) {
                    return {...user, last_name: updatedSurname};
                }
                return user;
            })
        );
    };

    const handleEmailChange = (e, userId) => {
        const updatedEmail = e.target.value;
        setUsers(
            users.map((user) => {
                if (user.id === userId) {
                    return {...user, email: updatedEmail};
                }
                return user;
            })
        );
    };
    //-------------------------------------ADMIN---------------------------------------

    const [admins, setAdmins] = useState([]);
    const [newAdminEmail, setNewAdminEmail] = useState('');

    useEffect(() => {
        if (activeTab === 'admin') {
            axios
                .get('http://127.0.0.1:5000/api/admin/get_all')
                .then((response) => {
                    setAdmins(
                        response.data.map((admin) => ({
                            id: admin._id.$oid,
                            email: admin.email,
                        }))
                    );
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [activeTab]);

    const handleAddAdmin = () => {
        const email = newEmail.trim();
        const password = newPassword.trim();

        if (!email || !password) {
            alert('Email and password cannot be empty');
            return;
        }

        axios
            .post(`http://127.0.0.1:5000/api/admin/register`, {
                email: email,
                password: password,
            })
            .then((response) => {
                console.log(response.data.message);
                setAdmins([
                    ...admins,
                    {
                        id: response.data.id,
                        email: email,
                    },
                ]);
            })
            .catch((error) => {
                console.log(error);
            });

        setNewEmail('');
        setNewPassword('');
    };

    const handleUpdateAdmin = (adminId) => {
        const admin = admins.find((admin) => admin.id === adminId);
        if (!admin) return;

        const updatedEmail = admin.email.trim();
        const updatedPassword = prompt('Enter new password');

        if (!updatedEmail || !updatedPassword) {
            alert('Email and password cannot be empty');
            return;
        }

        axios
            .put(
                `http://127.0.0.1:5000/api/admin/update_admin_by_id/${adminId}`,
                {
                    email: updatedEmail,
                    new_password: updatedPassword,
                }
            )
            .then((response) => {
                console.log(response.data.message);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleDeleteAdmin = (adminId) => {
        axios
            .delete(`http://127.0.0.1:5000/api/admin/delete_admin_by_id/${adminId}`)
            .then((response) => {
                console.log(response.data.message);
                setAdmins(admins.filter((admin) => admin.id !== adminId));
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleAdminEmailChange = (e, adminId) => {
        const updatedEmail = e.target.value;
        setAdmins(
            admins.map((admin) => {
                if (admin.id === adminId) {
                    return {...admin, email: updatedEmail};
                }
                return admin;
            })
        );
    };

    //---------------------------------Bulding--------------------------------------------

    const [buildings, setBuildings] = useState([]);
    const [newAddress, setNewAddress] = useState('');
    const [newBuildingUserId, setNewBuildingUserId] = useState('');


    useEffect(() => {
        if (activeTab === 'buildings') {
            axios
                .get('http://127.0.0.1:5000/api/buildings/get_all')
                .then((response) => {
                    setBuildings(
                        response.data.map((building) => ({
                            id: building._id.$oid,
                            address: building.address,
                            user_id: building.user_id,
                        }))
                    );
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [activeTab]);

    const handleAddBuilding = () => {
        const address = newAddress.trim();
        const userId = newBuildingUserId.trim();

        if (!address || !userId) {
            alert('Address and user ID cannot be empty');
            return;
        }

        axios
            .post(`http://127.0.0.1:5000/api/buildings/add_without_jwt`, {
                address: address,
                user_id: userId,
            })
            .then((response) => {
                console.log(response.data.message);
                setBuildings([
                    ...buildings,
                    {
                        id: response.data.id,
                        address: address,
                        user_id: userId,
                    },
                ]);
            })
            .catch((error) => {
                console.log(error);
            });

        setNewAddress('');
        setNewBuildingUserId('');
    };

    const handleUpdateBuilding = (buildingId) => {
        const building = buildings.find((building) => building.id === buildingId);
        if (!building) return;

        const updatedAddress = building.address.trim();
        const updatedUserId = prompt('Enter new user ID');

        if (!updatedAddress || !updatedUserId) {
            alert('Address and user ID cannot be empty');
            return;
        }

        axios
            .put(
                `http://127.0.0.1:5000/api/buildings/update/${buildingId}`,
                {
                    address: updatedAddress,
                    user_id: updatedUserId,
                }
            )
            .then((response) => {
                console.log(response.data.message);
                setBuildings(
                    buildings.map((building) => {
                        if (building.id === buildingId) {
                            return {...building, user_id: updatedUserId};
                        }
                        return building;
                    })
                );
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleDeleteBuilding = (buildingId) => {
        axios
            .delete(`http://127.0.0.1:5000/api/buildings/delete/${buildingId}`)
            .then((response) => {
                console.log(response.data.message);
                setBuildings(buildings.filter((building) => building.id !== buildingId));
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleAddressChange = (e, buildingId) => {
        const updatedAddress = e.target.value;
        setBuildings(
            buildings.map((building) => {
                if (building.id === buildingId) {
                    return {...building, address: updatedAddress};
                }
                return building;
            })
        );
    };

    //---------------------------------Goods-------------------------------

    const [goods, setGoods] = useState([]);
    const [newName, setNewName] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newBriefDescription, setNewBriefDescription] = useState('');
    const [newPrice, setNewPrice] = useState('');
    const [newImage, setNewImage] = useState('');

    useEffect(() => {
        if (activeTab === 'goods') {
            axios
                .get('http://127.0.0.1:5000/api/goods/get_all')
                .then((response) => {
                    setGoods(
                        response.data.map((good) => ({
                            id: good._id.$oid,
                            name: good.name,
                            description: good.description,
                            brief_description: good.brief_description,
                            price: good.price,
                            image: good.image,
                        }))
                    );
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [activeTab]);

    const handleAddGood = () => {
        const name = newName.trim();
        const description = newDescription.trim();
        const briefDescription = newBriefDescription.trim();
        const price = newPrice.trim();
        const image = newImage.trim();

        if (
            !name ||
            !description ||
            !briefDescription ||
            !price ||
            !image
        ) {
            alert(
                'Name, description, brief description, price and image cannot be empty'
            );
            return;
        }

        axios
            .post(`http://127.0.0.1:5000/api/goods/add`, {
                name: name,
                description: description,
                brief_description: briefDescription,
                price: price,
                image: image,
            })
            .then((response) => {
                console.log(response.data.message);
                setGoods([
                    ...goods,
                    {
                        id: response.data.id,
                        name: name,
                        description: description,
                        brief_description: briefDescription,
                        price: price,
                        image: image,
                    },
                ]);
            })
            .catch((error) => {
                console.log(error);
            });

        setNewName('');
        setNewDescription('');
        setNewBriefDescription('');
        setNewPrice('');
        setNewImage('');
    };

    const handleUpdateGood = (goodId) => {
        const good = goods.find((good) => good.id === goodId);
        if (!good) return;

        const updatedName = good.name.trim();
        const updatedDescription = good.description.trim();
        const updatedBriefDescription = good.brief_description.trim();
        const updatedPrice = prompt('Enter new price');
        const updatedImage = good.image.trim();

        if (
            !updatedName ||
            !updatedDescription ||
            !updatedBriefDescription ||
            !updatedPrice ||
            !updatedImage
        ) {
            alert(
                'Name, description, brief description, price and image cannot be empty'
            );
            return;
        }

        axios
            .put(
                `http://127.0.0.1:5000/api/goods/update/${goodId}`,
                {
                    name: updatedName,
                    description: updatedDescription,
                    brief_description: updatedBriefDescription,
                    price: updatedPrice,
                    image: updatedImage,
                }
            )
            .then((response) => {
                console.log(response.data.message);
                setGoods(
                    goods.map((good) => {
                        if (good.id === goodId) {
                            return {...good, price: updatedPrice};
                        }
                        return good;
                    })
                );
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleDeleteGood = (goodId) => {
        axios
            .delete(`http://127.0.0.1:5000/api/goods/delete/${goodId}`)
            .then((response) => {
                console.log(response.data.message);
                setGoods(goods.filter((good) => good.id !== goodId));
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleNameGoodChange = (e, goodId) => {
        const updatedName = e.target.value;
        setGoods(
            goods.map((good) => {
                if (good.id === goodId) {
                    return {...good, name: updatedName};
                }
                return good;
            })
        );
    };

    const handleDescriptionChange = (e, goodId) => {
        const updatedDescription = e.target.value;
        setGoods(
            goods.map((good) => {
                if (good.id === goodId) {
                    return {...good, description: updatedDescription};
                }
                return good;
            })
        );
    };

    const handleBriefDescriptionChange = (e, goodId) => {
        const updatedBriefDescription = e.target.value;
        setGoods(
            goods.map((good) => {
                if (good.id === goodId) {
                    return {...good, brief_description: updatedBriefDescription};
                }
                return good;
            })
        );
    };

    const handleImageChange = (e, goodId) => {
        const updatedImage = e.target.value;
        setGoods(
            goods.map((good) => {
                if (good.id === goodId) {
                    return {...good, image: updatedImage};
                }
                return good;
            })
        );
    };

    //--------------------------------Order-----------------------------------
    const [orders, setOrders] = useState([]);
    const [newBuildingId, setNewBuildingId] = useState('');
    const [newStartDate, setNewStartDate] = useState('');
    const [newEndDate, setNewEndDate] = useState('');
    const [newStatus, setNewStatus] = useState('');
    const [newUserId, setNewUserId] = useState('');
    const [newAdminOrderId, setNewAdminOrderId] = useState('');


    useEffect(() => {
        if (activeTab === 'order') {
            axios
                .get('http://127.0.0.1:5000/api/order/get_all_without_jwt')
                .then((response) => {
                    setOrders(
                        response.data.map((order) => ({
                            id: order._id.$oid,
                            building_id: order.building_id,
                            start_date: order.start_date,
                            end_date: order.end_date,
                            status: order.status,
                            user_id: order.user_id,
                            admin_id: order.admin_id
                        }))
                    );
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [activeTab]);

    const handleAddOrder = () => {
        const adminId = newAdminOrderId.trim();
        const buildingId = newBuildingId.trim();
        const startDate = newStartDate.trim();
        const endDate = newEndDate.trim();
        const status = newStatus.trim();
        const orderUserId = newUserId.trim();
        console.log(buildingId)
        console.log(startDate)
        console.log(endDate)
        console.log(status)
        console.log(orderUserId)

        if (
            !adminId ||
            !buildingId ||
            !startDate ||
            !endDate ||
            !status ||
            !orderUserId
        ) {
            alert(
                'Building ID, start date, end date, status and user ID cannot be empty'
            );
            return;
        }

        axios
            .post(`http://127.0.0.1:5000/api/order/add_without_jwt`, {
                user_id: orderUserId,
                admin_id: adminId,
                building_id: buildingId,
                start_date: startDate,
                end_date: endDate,
                status: status,
            })
            .then((response) => {
                console.log(response.data.message);
                setOrders([
                    ...orders,
                    {
                        user_id: orderUserId,
                        admin_id: adminId,
                        building_id: buildingId,
                        start_date: startDate,
                        end_date: endDate,
                        status: status,
                    },
                ]);
                console.log(orders)
            })
            .catch((error) => {
                console.log(error);
            });

        setNewAdminOrderId('')
        setNewBuildingId('');
        setNewStartDate('');
        setNewEndDate('');
        setNewStatus('');
        setNewUserId('');
    };

    const handleUpdateOrder = (orderId) => {
        const order = orders.find((order) => order.id === orderId);
        if (!order) return;

        const adminId = order.admin_id.trim();
        const updatedBuildingId = order.building_id.trim();
        const updatedStartDate = order.start_date.trim();
        const updatedEndDate = order.end_date.trim();
        const updatedStatus = order.status.trim();
        const updatedUserId = order.user_id.trim();

        if (
            !adminId ||
            !updatedBuildingId ||
            !updatedStartDate ||
            !updatedEndDate ||
            !updatedStatus ||
            !updatedUserId
        ) {
            alert(
                'Building ID, start date, end date, status and user ID cannot be empty'
            );
            return;
        }

        axios
            .put(
                `http://127.0.0.1:5000/api/order/update/${orderId}`,
                {
                    building_id: updatedBuildingId,
                    start_date: updatedStartDate,
                    end_date: updatedEndDate,
                    status: updatedStatus,
                    user_id: updatedUserId,
                    admin_id: adminId
                }
            )
            .then((response) => {
                console.log(response.data.message);
                setOrders(
                    orders.map((order) => {
                        if (order.id === orderId) {
                            return {...order, status: updatedStatus};
                        }
                        return order;
                    })
                );
                alert("Successful")
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleDeleteOrder = (orderId) => {
        axios
            .delete(`http://127.0.0.1:5000/api/order/delete/${orderId}`)
            .then((response) => {
                console.log(response.data.message);
                setOrders(orders.filter((order) => order.id !== orderId));
            })
            .catch((error) => {
                console.log(error);
            });
    };


    const handleInputAdminOrderChange = (e, orderId) => {
        const updatedAdminId = e.target.value;
        setOrders((prevOrders) =>
            prevOrders.map((order) => {
                if (order.id === orderId) {
                    return {...order, admin_id: updatedAdminId};
                }
                return order;
            })
        );
    };


    const handleInputChange = (e, orderId, field) => {
        const updatedValue = e.target.value;
        setOrders((prevOrders) =>
            prevOrders.map((order) => {
                if (order.id === orderId) {
                    return {...order, [field]: updatedValue};
                }
                return order;
            })
        );
    };


    const handleBuildingIdChange = (e, orderId) => {
        const updatedBuildingId = e.target.value;
        setOrders(
            orders.map((order) => {
                if (order.id === orderId) {
                    return {...order, building_id: updatedBuildingId};
                }
                return order;
            })
        );
    };

    const handleStartDateChange = (e, orderId) => {
        const updatedStartDate = e.target.value;
        setOrders(
            orders.map((order) => {
                if (order.id === orderId) {
                    return {...order, start_date: updatedStartDate};
                }
                return order;
            })
        );
    };

    const handleEndDateChange = (e, orderId) => {
        const updatedEndDate = e.target.value;
        setOrders(
            orders.map((order) => {
                if (order.id === orderId) {
                    return {...order, end_date: updatedEndDate};
                }
                return order;
            })
        );
    };

    const handleStatusChange = (e, orderId) => {
        const updatedStatus = e.target.value;
        setOrders(
            orders.map((order) => {
                if (order.id === orderId) {
                    return {...order, status: updatedStatus};
                }
                return order;
            })
        );
    };

    const handleUserIdChange = (e, orderId) => {
        const updatedUserId = e.target.value;
        setOrders(
            orders.map((order) => {
                if (order.id === orderId) {
                    return {...order, user_id: updatedUserId};
                }
                return order;
            })
        );
    };


    function logOut() {
        localStorage.clear('admin_access')
        window.location.href = `/login`;
    }

    //-------------------------Daily---------------------------------------------------

    const [daily, setDaily] = useState([]);
    const [newDate, setNewDate] = useState('');
    const [newDayTemperature, setNewDayTemperature] = useState('');
    const [newElectricityCount, setNewElectricityCount] = useState('');
    const [newGasCount, setNewGasCount] = useState('');
    const [newWaterCount, setNewWaterCount] = useState('');
    const [newDailyUserId, setNewDailyUserId] = useState('');

// ...

    useEffect(() => {
        if (activeTab === 'daily') {
            axios
                .get('http://127.0.0.1:5000/api/daily/get_all_daily')
                .then((response) => {
                    setDaily(response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [activeTab]);

    const handleAddDaily = () => {
        const date = newDate.trim();
        const dayTemperature = parseFloat(newDayTemperature.trim());
        const electricityCount = newElectricityCount.trim();
        const gasCount = newGasCount.trim();
        const waterCount = newWaterCount.trim();
        const userId = newDailyUserId.trim();

        console.log(`updatedDate: ` + date)
        console.log(`updatedDayTemperature: ` + dayTemperature)
        console.log(`updatedElectricityCount: ` + electricityCount)
        console.log(`updatedGasCount: ` + gasCount)
        console.log(`updatedWaterCount: ` + waterCount)
        console.log(`updatedUserId: ` + userId)

        if (
            !date ||
            isNaN(dayTemperature) ||
            !electricityCount ||
            !gasCount ||
            !waterCount ||
            !userId
        ) {
            alert('Please fill in all the fields correctly');
            return;
        }

        axios
            .post('http://127.0.0.1:5000/api/daily/add_with_date', {
                date: date,
                day_temperature: dayTemperature,
                electricity_count: electricityCount,
                gas_count: gasCount,
                water_count: waterCount,
                user_id: userId,
            })
            .then((response) => {
                console.log(response.data.message);
                setDaily([
                    ...daily,
                    {
                        _id: response.data._id,
                        date: date,
                        day_temperature: dayTemperature,
                        electricity_count: electricityCount,
                        gas_count: gasCount,
                        water_count: waterCount,
                        user_id: userId,
                    },
                ]);
            })
            .catch((error) => {
                console.log(error);
            });

        setNewDate('');
        setNewDayTemperature('');
        setNewElectricityCount('');
        setNewGasCount('');
        setNewWaterCount('');
        setNewDailyUserId('');
    };

    const handleUpdateDaily = (dailyId) => {
        console.log(dailyId)
        const dailyData = daily.find((item) => item._id.$oid === dailyId);
        if (!dailyData) {
            console.log(`No daily data found for id: ${dailyId}`);
            return;
        }
        console.log(dailyData)
        console.log(dailyData)
        const updatedDayTemperature = dailyData.day_temperature;
        const updatedElectricityCount = dailyData.electricity_count;
        const updatedGasCount = dailyData.gas_count;
        const updatedWaterCount = dailyData.water_count;
        const updatedUserId = dailyData.user_id;

        console.log(`updatedDayTemperature: ` + updatedDayTemperature)
        console.log(`updatedElectricityCount: ` + updatedElectricityCount)
        console.log(`updatedGasCount: ` + updatedGasCount)
        console.log(`updatedWaterCount: ` + updatedWaterCount)
        console.log(`updatedUserId: ` + updatedUserId)
        if (
            isNaN(updatedDayTemperature) ||
            !updatedElectricityCount ||
            !updatedGasCount ||
            !updatedWaterCount ||
            !updatedUserId
        ) {
            alert('Please fill in all the fields correctly');
            return;
        }

        axios
            .put(`http://127.0.0.1:5000/api/daily/update/${dailyId}`, {
                day_temperature: updatedDayTemperature,
                electricity_count: updatedElectricityCount,
                gas_count: updatedGasCount,
                water_count: updatedWaterCount,
                user_id: updatedUserId,
            })
            .then((response) => {
                console.log(response.data.message);
                setDaily(
                    daily.map((item) => {
                        if (item._id.$oid === dailyId) {
                            return {
                                ...item,
                                day_temperature: updatedDayTemperature,
                                electricity_count: updatedElectricityCount,
                                gas_count: updatedGasCount,
                                water_count: updatedWaterCount,
                                user_id: updatedUserId,
                            };
                        }
                        return item;
                    })
                );
                alert('Updated successfully');
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleDeleteDaily = (dailyId) => {
        axios
            .delete(`http://127.0.0.1:5000//api/daily/delete/${dailyId}`)
            .then((response) => {
                console.log(response.data.message);
                setDaily(daily.filter((item) => item._id.$oid !== dailyId));
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleDateChange = (e, dailyId) => {
        const updatedDate = e.target.value;
        setDaily(
            daily.map((item) => {
                if (item._id.$oid === dailyId) {
                    return {
                        ...item,
                        date: updatedDate,
                    };
                }
                return item;
            })
        );
    };

    const handleDayTemperatureChange = (e, dailyId) => {
        const updatedDayTemperature = parseFloat(e.target.value);
        setDaily(
            daily.map((item) => {
                if (item._id.$oid === dailyId) {
                    return {
                        ...item,
                        day_temperature: updatedDayTemperature,
                    };
                }
                return item;
            })
        );
    };

    const handleElectricityCountChange = (e, dailyId) => {
        const updatedElectricityCount = e.target.value;
        setDaily(
            daily.map((item) => {
                if (item._id.$oid === dailyId) {
                    return {
                        ...item,
                        electricity_count: updatedElectricityCount,
                    };
                }
                return item;
            })
        );
    };

    const handleGasCountChange = (e, dailyId) => {
        const updatedGasCount = e.target.value;
        setDaily(
            daily.map((item) => {
                if (item._id.$oid === dailyId) {
                    return {
                        ...item,
                        gas_count: updatedGasCount,
                    };
                }
                return item;
            })
        );
    };

    const handleWaterCountChange = (e, dailyId) => {
        const updatedWaterCount = e.target.value;
        setDaily(
            daily.map((item) => {
                if (item._id.$oid === dailyId) {
                    return {
                        ...item,
                        water_count: updatedWaterCount,
                    };
                }
                return item;
            })
        );
    };

    const handleDailyUserIdChange = (e, dailyId) => {
        const updatedUserId = e.target.value;
        setDaily(
            daily.map((item) => {
                if (item._id.$oid === dailyId) {
                    return {
                        ...item,
                        user_id: updatedUserId,
                    };
                }
                return item;
            })
        );
    };

    //--------------------------------Monthly-----------------------------------------
    const [monthly, setMonthly] = useState([]);
    const [newAvgElectricityCount, setNewAvgElectricityCount] = useState('');
    const [newAvgGasCount, setNewAvgGasCount] = useState('');
    const [newAvgTemperatureCount, setNewAvgTemperatureCount] = useState('');
    const [newAvgWaterCount, setNewAvgWaterCount] = useState('');
    const [newMonthlyDate, setNewMonthlyDate] = useState('');
    const [newMonthlyMonth, setNewMonthlyMonth] = useState('');
    const [newMonthlyUserId, setNewMonthlyUserId] = useState('');

// ...

    useEffect(() => {
        if (activeTab === 'monthly') {
            axios
                .get('http://127.0.0.1:5000/api/monthly/averages/get')
                .then((response) => {
                    setMonthly(response.data);
                    console.log(response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [activeTab]);

    const handleAddMonthly = () => {
        const userId = newMonthlyUserId.trim();
        const avgElectricityCount = newAvgElectricityCount.trim();
        const avgGasCount = newAvgGasCount.trim();
        const avgTemperatureCount = newAvgTemperatureCount.trim();
        const avgWaterCount = newAvgWaterCount.trim();
        const monthlyDate = newMonthlyDate.trim();
        const monthlyMonth = newMonthlyMonth.trim();

        if (
            !userId ||
            !avgElectricityCount ||
            !avgGasCount ||
            !avgTemperatureCount ||
            !avgWaterCount ||
            !monthlyDate ||
            !monthlyMonth
        ) {
            alert('Please fill in all the fields correctly');
            return;
        }

        axios
            .post('http://127.0.0.1:5000/api/monthly/add', {
                avg_electricity_count: avgElectricityCount,
                avg_gas_count: avgGasCount,
                avg_temperature_count: avgTemperatureCount,
                avg_water_count: avgWaterCount,
                date: monthlyDate,
                month: monthlyMonth,
                user_id: userId
            })
            .then((response) => {
                console.log(response.data.message);
                setMonthly([
                    ...monthly,
                    {
                        _id: response.data._id,
                        avg_electricity_count: avgElectricityCount,
                        avg_gas_count: avgGasCount,
                        avg_temperature_count: avgTemperatureCount,
                        avg_water_count: avgWaterCount,
                        date: monthlyDate,
                        month: monthlyMonth,
                        user_id: userId
                    },
                ]);
            })
            .catch((error) => {
                console.log(error);
            });

        setNewMonthlyUserId('');
        setNewAvgElectricityCount('');
        setNewAvgGasCount('');
        setNewAvgTemperatureCount('');
        setNewAvgWaterCount('');
        setNewMonthlyDate('');
        setNewMonthlyMonth('');
    };

    const handleUpdateMonthly = (monthlyId) => {
        const monthlyData = monthly.find((item) => item._id === monthlyId);
        if (!monthlyData) {
            console.log(`No monthly data found for id: ${monthlyId}`);
            return;
        }
        const updatedUserId = monthlyData.user_id;
        const updatedAvgElectricityCount = monthlyData.avg_electricity_count;
        const updatedAvgGasCount = monthlyData.avg_gas_count;
        const updatedAvgTemperatureCount = monthlyData.avg_temperature_count;
        const updatedAvgWaterCount = monthlyData.avg_water_count;
        const updatedMonthlyDate = monthlyData.date;
        const updatedMonthlyMonth = monthlyData.month;
        console.log(updatedUserId)
        console.log(updatedAvgElectricityCount)
        console.log(updatedAvgGasCount)
        console.log(updatedAvgTemperatureCount)
        console.log(updatedAvgWaterCount)
        console.log(updatedMonthlyDate)
        console.log(updatedMonthlyMonth)
        if (
            !updatedUserId ||
            !updatedAvgElectricityCount ||
            !updatedAvgGasCount ||
            !updatedAvgTemperatureCount ||
            !updatedAvgWaterCount ||
            !updatedMonthlyDate ||
            !updatedMonthlyMonth
        ) {
            alert('Please fill in all the fields correctly');
            return;
        }

        axios
            .put(`http://127.0.0.1:5000/api/monthly/update/${monthlyId}`, {
                user_id: updatedUserId,
                avg_electricity_count: updatedAvgElectricityCount,
                avg_gas_count: updatedAvgGasCount,
                avg_temperature_count: updatedAvgTemperatureCount,
                avg_water_count: updatedAvgWaterCount,
                date: updatedMonthlyDate,
                month: updatedMonthlyMonth,
            })
            .then((response) => {
                console.log(response.data.message);
                const updatedMonthlyData = monthly.map((item) => {
                    if (item._id === monthlyId) {
                        return {
                            _id: item._id,
                            user_id: updatedUserId,
                            avg_electricity_count: updatedAvgElectricityCount,
                            avg_gas_count: updatedAvgGasCount,
                            avg_temperature_count: updatedAvgTemperatureCount,
                            avg_water_count: updatedAvgWaterCount,
                            date: updatedMonthlyDate,
                            month: updatedMonthlyMonth,
                        };
                    }
                    return item;
                });
                setMonthly(updatedMonthlyData);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleDeleteMonthly = (monthlyId) => {
        axios
            .delete(`http://127.0.0.1:5000/api/monthly/delete/${monthlyId}`)
            .then((response) => {
                console.log(response.data.message);
                const updatedMonthlyData = monthly.filter(
                    (item) => item._id.$oid !== monthlyId
                );
                setMonthly(updatedMonthlyData);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleMonthlyUserId = (e, monthlyId) => {
        const updatedMonthlyUserId = e.target.value;
        setMonthly(
            monthly.map((item) => {
                if (item._id === monthlyId) {
                    return {
                        ...item,
                        user_id: updatedMonthlyUserId,
                    };
                }
                return item;
            })
        );
    };

    const handleAvgElectricityCountChange = (e, monthlyId) => {
        const updatedAvgElectricityCount = e.target.value;
        setMonthly(
            monthly.map((item) => {
                if (item._id === monthlyId) {
                    return {
                        ...item,
                        avg_electricity_count: updatedAvgElectricityCount,
                    };
                }
                return item;
            })
        );
    };


    const handleAvgGasCountChange = (e, monthlyId) => {
        const updatedAvgGasCount = e.target.value;
        setMonthly(
            monthly.map((item) => {
                if (item._id === monthlyId) {
                    return {
                        ...item,
                        avg_gas_count: updatedAvgGasCount,
                    };
                }
                return item;
            })
        );
    };

    const handleAvgTemperatureCountChange = (e, monthlyId) => {
        const updatedAvgTemperatureCount = e.target.value;
        setMonthly(
            monthly.map((item) => {
                if (item._id === monthlyId) {
                    return {
                        ...item,
                        avg_temperature_count: updatedAvgTemperatureCount,
                    };
                }
                return item;
            })
        );
    };

    const handleAvgWaterCountChange = (e, monthlyId) => {
        const updatedAvgWaterCount = e.target.value;
        setMonthly(
            monthly.map((item) => {
                if (item._id === monthlyId) {
                    return {
                        ...item,
                        avg_water_count: updatedAvgWaterCount,
                    };
                }
                return item;
            })
        );
    };

    const handleMonthlyDateChange = (e, monthlyId) => {
        const updatedMonthlyDate = e.target.value;
        setMonthly(
            monthly.map((item) => {
                if (item._id === monthlyId) {
                    return {
                        ...item,
                        date: updatedMonthlyDate,
                    };
                }
                return item;
            })
        );
    };

    const handleMonthlyMonthChange = (e, monthlyId) => {
        const updatedMonthlyMonth = e.target.value;
        setMonthly(
            monthly.map((item) => {
                if (item._id === monthlyId) {
                    return {
                        ...item,
                        month: updatedMonthlyMonth,
                    };
                }
                return item;
            })
        );
    };

    //------------------------------Manage--------------------------------------
    const [ordersStatus, setOrdersStatus] = useState([]);

    useEffect(() => {
        if (activeTab === 'manage') {
            const adminAccess = localStorage.getItem('admin_access');
            console.log(adminAccess)
            axios
                .get('http://127.0.0.1:5000/api/admin/get_all_orders', {
                    headers: {
                        Authorization: `Bearer ${adminAccess}`,
                    },
                })
                .then((response) => {
                    setOrdersStatus(response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [activeTab]);

    const handleUpdateOrderStatus = (orderId, status) => {
        axios
            .put(`http://127.0.0.1:5000/api/order/update_status/${orderId}`, {
                status: status,
            })
            .then((response) => {
                console.log(response.data.message);
                setOrdersStatus(
                    ordersStatus.map((order) => {
                        if (order.order_id?.$oid === orderId) {
                            return {
                                ...order,
                                status: status,
                            };
                        }
                        return order;
                    })
                );
                alert('Order status updated successfully');
            })
            .catch((error) => {
                console.log(error);
            });
    };


    return (
        <div style={{width: '100%'}}>
            <ul className="nav nav-tabs">
                <li className={`nav-item ${activeTab === 'user' ? 'active' : ''}`}>
                    <button
                        className={`nav-link ${activeTab === 'user' ? 'active' : ''}`}
                        onClick={() => handleTabChange('user')}
                    >
                        {t('users')}
                    </button>
                </li>
                <li className={`nav-item ${activeTab === 'admin' ? 'active' : ''}`}>
                    <button
                        className={`nav-link ${activeTab === 'admin' ? 'active' : ''}`}
                        onClick={() => handleTabChange('admin')}
                    >
                        {t('adminNav')}
                    </button>
                </li>
                <li className={`nav-item ${activeTab === 'buildings' ? 'active' : ''}`}>
                    <button
                        className={`nav-link ${activeTab === 'buildings' ? 'active' : ''}`}
                        onClick={() => handleTabChange('buildings')}
                    >
                        {t('buildingsNav')}
                    </button>
                </li>
                <li className={`nav-item ${activeTab === 'goods' ? 'active' : ''}`}>
                    <button
                        className={`nav-link ${activeTab === 'goods' ? 'active' : ''}`}
                        onClick={() => handleTabChange('goods')}
                    >
                        {t('goodsNav')}
                    </button>
                </li>
                <li className={`nav-item ${activeTab === 'order' ? 'active' : ''}`}>
                    <button
                        className={`nav-link ${activeTab === 'order' ? 'active' : ''}`}
                        onClick={() => handleTabChange('order')}
                    >
                        {t('ordersNav')}
                    </button>
                </li>
                <li className={`nav-item ${activeTab === 'daily' ? 'active' : ''}`}>
                    <button
                        className={`nav-link ${activeTab === 'daily' ? 'active' : ''}`}
                        onClick={() => handleTabChange('daily')}
                    >
                        {t('dailyNav')}
                    </button>
                </li>
                <li className={`nav-item ${activeTab === 'monthly' ? 'active' : ''}`}>
                    <button
                        className={`nav-link ${activeTab === 'monthly' ? 'active' : ''}`}
                        onClick={() => handleTabChange('monthly')}
                    >
                        {t('monthlyNav')}
                    </button>
                </li>
                <li className={`nav-item ${activeTab === 'manage' ? 'active' : ''}`}>
                    <button
                        className={`nav-link ${activeTab === 'manage' ? 'active' : ''}`}
                        onClick={() => handleTabChange('manage')}
                    >
                        {t('manageNav')}
                    </button>
                </li>
                <li className={`nav-item ${activeTab === 'logOut' ? 'active' : ''}`}>
                    <button
                        className={`nav-link ${activeTab === 'logOut' ? 'active' : ''}`}
                        onClick={() => logOut()}
                    >
                        {t('logOutNav')}
                    </button>
                </li>
                <li>
                    <LanguageSelector/>
                </li>
            </ul>
            <div className="tab-content">
                {activeTab === 'user' && (
                    <div style={{marginLeft: '2%'}} className="table-responsive">
                        <table style={{width: '100%', borderCollapse: 'collapse'}}>
                            <thead>
                            <tr>
                                <th>{t('firstName')}</th>
                                <th>{t('lastName')}</th>
                                <th>{t('email')}</th>
                                <th>{t('password')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>
                                    <input
                                        type="text"
                                        placeholder={t('firstNamePlaceholder')}
                                        value={newFirstName}
                                        onChange={(e) => setNewFirstName(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        placeholder={t('lastNamePlaceholder')}
                                        value={newLastName}
                                        onChange={(e) => setNewLastName(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        placeholder={t('emailPlaceholder')}
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="password"
                                        placeholder={t('passwordPlaceholder')}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <Button
                                        onClick={handleAddUser}
                                        style={{
                                            marginTop: '5px',
                                            backgroundColor: '#dbe0f4',
                                            fontSize: '15px',
                                        }}
                                    >
                                        {t('addButton')}
                                    </Button>
                                </td>
                            </tr>
                            </tbody>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>{t('email')}</th>
                                <th>{t('name')}</th>
                                <th>{t('surname')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>
                                        <input
                                            type="text"
                                            value={user.email}
                                            onChange={(e) => handleEmailChange(e, user.id)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={user.first_name}
                                            onChange={(e) => handleNameChange(e, user.id)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={user.last_name}
                                            onChange={(e) => handleSurnameChange(e, user.id)}
                                        />
                                    </td>
                                    <td>
                                        <Button
                                            onClick={() => updateUser(user.id)}
                                            style={{
                                                backgroundColor: '#dbe0f4',
                                                fontSize: '15px',
                                                marginBottom: '8px',
                                            }}
                                        >
                                            {t('updateButton')}
                                        </Button>
                                        <Button
                                            onClick={() => deleteUser(user.id)}
                                            style={{
                                                marginLeft: '10px',
                                                backgroundColor: '#dbe0f4',
                                                fontSize: '15px',
                                                marginBottom: '8px',
                                            }}
                                        >
                                            {t('deleteButton')}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {activeTab === 'admin' && (
                    <div style={{marginLeft: '2%'}} className="table-responsive">
                        <table style={{width: '100%', borderCollapse: 'collapse'}}>
                            <thead>
                            <tr>
                                <th>{t('admin.email')}</th>
                                <th>{t('admin.password')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            <td>
                                <input
                                    type="text"
                                    placeholder={t('admin.emailPlaceholder')}
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="password"
                                    placeholder={t('admin.passwordPlaceholder')}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </td>
                            <td>
                                <Button
                                    onClick={handleAddAdmin}
                                    style={{
                                        backgroundColor: '#dbe0f4',
                                        fontSize: '15px',
                                        marginBottom: '8px',
                                    }}
                                >
                                    {t('admin.addButton')}
                                </Button>
                            </td>
                            </tbody>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>{t('admin.email')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {admins.map((admin) => (
                                <tr key={admin.id}>
                                    <td>{admin.id}</td>
                                    <td>
                                        <input
                                            type="text"
                                            value={admin.email}
                                            onChange={(e) => handleAdminEmailChange(e, admin.id)}
                                        />
                                    </td>
                                    <td>
                                        <Button
                                            onClick={() => handleUpdateAdmin(admin.id)}
                                            style={{
                                                backgroundColor: '#dbe0f4',
                                                fontSize: '15px',
                                                marginBottom: '8px',
                                                marginRight: '4%'
                                            }}
                                        >
                                            {t('admin.updateButton')}
                                        </Button>
                                        <Button
                                            onClick={() => handleDeleteAdmin(admin.id)}
                                            style={{
                                                backgroundColor: '#dbe0f4',
                                                fontSize: '15px',
                                                marginBottom: '8px',
                                            }}
                                        >
                                            {t('admin.deleteButton')}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'buildings' && (
                    <div style={{
                        marginLeft: '2%'
                    }} className="table-responsive">
                        <table style={{width: '100%', borderCollapse: 'collapse'}}>
                            <thead>
                            <tr>
                                <th>{t('buildings.address')}</th>
                                <th>{t('buildings.userId')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>
                                    <input
                                        type="text"
                                        placeholder={t('buildings.addressPlaceholder')}
                                        value={newAddress}
                                        onChange={(e) => setNewAddress(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        placeholder={t('buildings.userIdPlaceholder')}
                                        value={newBuildingUserId}
                                        onChange={(e) => setNewBuildingUserId(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <Button
                                        onClick={handleAddBuilding}
                                        style={{
                                            backgroundColor: '#dbe0f4',
                                            fontSize: '15px',
                                            marginBottom: '8px',
                                        }}
                                    >
                                        {t('buildings.addButton')}
                                    </Button>
                                </td>
                            </tr>
                            </tbody>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>{t('buildings.address')}</th>
                                <th>{t('buildings.userId')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {buildings.map((building) => (
                                <tr key={building.id}>
                                    <td>{building.id}</td>
                                    <td>
                                        <input
                                            type="text"
                                            value={building.address}
                                            onChange={(e) => handleAddressChange(e, building.id)}
                                        />
                                    </td>
                                    <td>{building.user_id}</td>
                                    <td></td>
                                    <td>
                                        <Button
                                            onClick={() => handleUpdateBuilding(building.id)}
                                            style={{
                                                backgroundColor: '#dbe0f4',
                                                fontSize: '15px',
                                                marginBottom: '8px',
                                            }}
                                        >
                                            {t('buildings.updateButton')}
                                        </Button>
                                        <Button
                                            onClick={() => handleDeleteBuilding(building.id)}
                                            style={{
                                                backgroundColor: '#dbe0f4',
                                                fontSize: '15px',
                                                marginBottom: '8px',
                                                left: '4%',
                                            }}
                                        >
                                            {t('buildings.deleteButton')}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {activeTab === 'goods' && (
                    <div className="table-responsive">
                        <table>
                            <thead>
                            <tr>
                                <th>{t('goods.name')}</th>
                                <th>{t('goods.description')}</th>
                                <th>{t('goods.briefDescription')}</th>
                                <th>{t('goods.price')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>
                                    <input
                                        type="text"
                                        placeholder={t('goods.namePlaceholder')}
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        placeholder={t('goods.descriptionPlaceholder')}
                                        value={newDescription}
                                        onChange={(e) => setNewDescription(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        placeholder={t('goods.briefDescriptionPlaceholder')}
                                        value={newBriefDescription}
                                        onChange={(e) => setNewBriefDescription(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        placeholder={t('goods.pricePlaceholder')}
                                        value={newPrice}
                                        onChange={(e) => setNewPrice(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        placeholder={t('goods.imageURLPlaceholder')}
                                        value={newImage}
                                        onChange={(e) => setNewImage(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <Button
                                        onClick={handleAddGood}
                                        style={{
                                            backgroundColor: '#dbe0f4',
                                            fontSize: '15px',
                                            marginBottom: '8px',
                                        }}
                                    >
                                        {t('goods.addButton')}
                                    </Button>
                                </td>
                            </tr>
                            </tbody>

                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>{t('goods.name')}</th>
                                <th>{t('goods.description')}</th>
                                <th>{t('goods.briefDescription')}</th>
                                <th>{t('goods.img')}</th>
                                <th>{t('goods.price')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {goods.map((good) => (
                                <tr key={good.id}>
                                    <td>{good.id}</td>
                                    <td>
                                        <input
                                            type="text"
                                            value={good.name}
                                            onChange={(e) => handleNameGoodChange(e, good.id)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={good.description}
                                            onChange={(e) => handleDescriptionChange(e, good.id)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={good.brief_description}
                                            onChange={(e) => handleBriefDescriptionChange(e, good.id)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={good.image}
                                            onChange={(e) => handleImageChange(e, good.id)}
                                        />
                                    </td>
                                    <td>{good.price}</td>
                                    <td>
                                        <Button
                                            onClick={() => handleUpdateGood(good.id)}
                                            style={{
                                                backgroundColor: '#dbe0f4',
                                                fontSize: '15px',
                                                marginBottom: '8px',
                                            }}
                                        >
                                            {t('goods.updateButton')}
                                        </Button>
                                        <Button
                                            onClick={() => handleDeleteGood(good.id)}
                                            style={{
                                                backgroundColor: '#dbe0f4',
                                                fontSize: '15px',
                                                marginBottom: '8px',
                                            }}
                                        >
                                            {t('goods.deleteButton')}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {activeTab === 'order' && (
                    <div style={{marginLeft: '2%'}} className="table-responsive">
                        <table>
                            <thead>
                            <tr>
                                <th>{t('order.userId')}</th>
                                <th>{t('order.adminId')}</th>
                                <th>{t('order.buildingId')}</th>
                                <th>{t('order.startDate')}</th>
                                <th>{t('order.endDate')}</th>
                                <th>{t('order.status')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>
                                    <input
                                        type="text"
                                        placeholder={t('order.userIdPlaceholder')}
                                        value={newUserId}
                                        onChange={(e) => setNewUserId(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        placeholder={t('order.adminIdPlaceholder')}
                                        value={newAdminOrderId}
                                        onChange={(e) => setNewAdminOrderId(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        placeholder={t('order.buildingIdPlaceholder')}
                                        value={newBuildingId}
                                        onChange={(e) => setNewBuildingId(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        placeholder={t('order.startDatePlaceholder')}
                                        value={newStartDate}
                                        onChange={(e) => setNewStartDate(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        placeholder={t('order.endDatePlaceholder')}
                                        value={newEndDate}
                                        onChange={(e) => setNewEndDate(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        placeholder={t('order.statusPlaceholder')}
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <Button
                                        onClick={handleAddOrder}
                                        style={{
                                            backgroundColor: '#dbe0f4',
                                            fontSize: '15px',
                                            marginBottom: '8px',
                                        }}
                                    >
                                        {t('order.addButton')}
                                    </Button>
                                </td>
                            </tr>
                            </tbody>
                            <thead>
                            <tr>
                                <th>{t('order.orderId')}</th>
                                <th>{t('order.buildingId')}</th>
                                <th>{t('order.userId')}</th>
                                <th>{t('order.adminId')}</th>
                                <th>{t('order.startDate')}</th>
                                <th>{t('order.endDate')}</th>
                                <th>{t('order.status')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>
                                        <input
                                            type="text"
                                            value={order.building_id}
                                            onChange={(e) => handleInputChange(e, order.id, 'building_id')}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={order.user_id}
                                            onChange={(e) => handleInputChange(e, order.id, 'user_id')}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={order.admin_id}
                                            onChange={(e) => handleInputAdminOrderChange(e, order.id)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={order.start_date}
                                            onChange={(e) => handleInputChange(e, order.id, 'start_date')}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={order.end_date}
                                            onChange={(e) => handleInputChange(e, order.id, 'end_date')}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={order.status}
                                            onChange={(e) => handleInputChange(e, order.id, 'status')}
                                        />
                                    </td>
                                    <td>
                                        <Button
                                            onClick={() => handleUpdateOrder(order.id)}
                                            style={{
                                                backgroundColor: '#dbe0f4',
                                                fontSize: '15px',
                                                marginBottom: '8px',
                                            }}
                                        >
                                            {t('order.updateButton')}
                                        </Button>
                                        <Button
                                            onClick={() => handleDeleteOrder(order.id)}
                                            style={{
                                                backgroundColor: '#dbe0f4',
                                                fontSize: '15px',
                                                marginBottom: '8px',
                                            }}
                                        >
                                            {t('order.deleteButton')}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {activeTab === 'daily' && (
                    <div className="table-responsive">
                        <table>
                            <thead>
                            <tr>
                                <th>{t('daily.userId')}</th>
                                <th>{t('daily.gasCount')}</th>
                                <th>{t('daily.electricityCount')}</th>
                                <th>{t('daily.waterCount')}</th>
                                <th>{t('daily.dayTemperature')}</th>
                                <th>{t('daily.date')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>
                                    <input
                                        type="text"
                                        placeholder={t('daily.userIdPlaceholder')}
                                        value={newDailyUserId}
                                        onChange={(e) => setNewDailyUserId(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        placeholder={t('daily.gasCountPlaceholder')}
                                        value={newGasCount}
                                        onChange={(e) => setNewGasCount(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        placeholder={t('daily.electricityCountPlaceholder')}
                                        value={newElectricityCount}
                                        onChange={(e) => setNewElectricityCount(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        placeholder={t('daily.waterCountPlaceholder')}
                                        value={newWaterCount}
                                        onChange={(e) => setNewWaterCount(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        placeholder={t('daily.dayTemperaturePlaceholder')}
                                        value={newDayTemperature}
                                        onChange={(e) => setNewDayTemperature(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        placeholder={t('daily.datePlaceholder')}
                                        value={newDate}
                                        onChange={(e) => setNewDate(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <Button
                                        onClick={handleAddDaily}
                                        style={{
                                            backgroundColor: '#dbe0f4',
                                            fontSize: '15px',
                                            marginBottom: '8px',
                                        }}
                                    >
                                        {t('daily.addButton')}
                                    </Button>
                                </td>
                            </tr>
                            </tbody>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>{t('daily.date')}</th>
                                <th>{t('daily.dayTemperature')}</th>
                                <th>{t('daily.electricityCount')}</th>
                                <th>{t('daily.gasCount')}</th>
                                <th>{t('daily.waterCount')}</th>
                                <th>{t('daily.userId')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {daily.map((item) => (
                                <tr key={item._id?.$oid}>
                                    <td>{item._id?.$oid}</td>
                                    <td>
                                        <input
                                            type="text"
                                            value={item.date}
                                            onChange={(e) => handleDateChange(e, item._id)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={item.day_temperature}
                                            onChange={(e) => handleDayTemperatureChange(e, item._id)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={item.electricity_count}
                                            onChange={(e) => handleElectricityCountChange(e, item._id?.$oid)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={item.gas_count}
                                            onChange={(e) => handleGasCountChange(e, item._id?.$oid)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={item.water_count}
                                            onChange={(e) => handleWaterCountChange(e, item._id?.$oid)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={item.user_id}
                                            onChange={(e) => handleDailyUserIdChange(e, item._id?.$oid)}
                                        />
                                    </td>
                                    <td>
                                        <Button
                                            onClick={() => handleUpdateDaily(item._id?.$oid)}
                                            style={{
                                                backgroundColor: '#dbe0f4',
                                                fontSize: '15px',
                                                marginBottom: '8px',
                                            }}
                                        >
                                            {t('daily.updateButton')}
                                        </Button>
                                        <Button
                                            onClick={() => handleDeleteDaily(item._id?.$oid)}
                                            style={{
                                                backgroundColor: '#f4b5b7',
                                                fontSize: '15px',
                                            }}
                                        >
                                            {t('daily.deleteButton')}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'monthly' && (
                    <div className="table-responsive">
                        <table style={{width: '100%', borderCollapse: 'collapse'}}>
                            <thead>
                            <tr>
                                <th>{t('monthly.userId')}</th>
                                <th>{t('monthly.avgElectricityCount')}</th>
                                <th>{t('monthly.avgGasCount')}</th>
                                <th>{t('monthly.avgTemperatureCount')}</th>
                                <th>{t('monthly.avgWaterCount')}</th>
                                <th>{t('monthly.date')}</th>
                                <th>{t('monthly.month')}</th>
                                <th>{t('monthly.actions')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>
                                    <input
                                        type="text"
                                        placeholder={t('monthly.userId')}
                                        value={newMonthlyUserId}
                                        onChange={(e) => setNewMonthlyUserId(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        placeholder={t('monthly.avgElectricityCount')}
                                        value={newAvgElectricityCount}
                                        onChange={(e) => setNewAvgElectricityCount(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        placeholder={t('monthly.avgGasCount')}
                                        value={newAvgGasCount}
                                        onChange={(e) => setNewAvgGasCount(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        placeholder={t('monthly.avgTemperatureCount')}
                                        value={newAvgTemperatureCount}
                                        onChange={(e) => setNewAvgTemperatureCount(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        placeholder={t('monthly.avgWaterCount')}
                                        value={newAvgWaterCount}
                                        onChange={(e) => setNewAvgWaterCount(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        placeholder={t('monthly.date')}
                                        value={newMonthlyDate}
                                        onChange={(e) => setNewMonthlyDate(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        placeholder={t('monthly.month')}
                                        value={newMonthlyMonth}
                                        onChange={(e) => setNewMonthlyMonth(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <Button
                                        onClick={handleAddMonthly}
                                        style={{
                                            backgroundColor: '#dbe0f4',
                                            fontSize: '15px',
                                            marginBottom: '8px',
                                        }}
                                    >
                                        {t('monthly.addButton')}
                                    </Button>
                                </td>
                            </tr>
                            </tbody>
                            <thead>
                            <tr>
                                <th>{t('monthly.userId')}</th>
                                <th>{t('monthly.avgElectricityCount')}</th>
                                <th>{t('monthly.avgGasCount')}</th>
                                <th>{t('monthly.avgTemperatureCount')}</th>
                                <th>{t('monthly.avgWaterCount')}</th>
                                <th>{t('monthly.date')}</th>
                                <th>{t('monthly.month')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {monthly.map((item) => (
                                <tr key={item._id}>
                                    <td>{item._id}</td>
                                    <td>
                                        <input
                                            type="text"
                                            value={item.user_id}
                                            onChange={(e) => handleMonthlyUserId(e, item._id)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={item.avg_electricity_count}
                                            onChange={(e) => handleAvgElectricityCountChange(e, item._id)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={item.avg_gas_count}
                                            onChange={(e) => handleAvgGasCountChange(e, item._id)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={item.avg_temperature_count}
                                            onChange={(e) => handleAvgTemperatureCountChange(e, item._id)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={item.avg_water_count}
                                            onChange={(e) => handleAvgWaterCountChange(e, item._id)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={item.date}
                                            onChange={(e) => handleMonthlyDateChange(e, item._id)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={item.month}
                                            onChange={(e) => handleMonthlyMonthChange(e, item._id)}
                                        />
                                    </td>
                                    <td>
                                        <Button
                                            onClick={() => handleUpdateMonthly(item._id)}
                                            style={{
                                                backgroundColor: '#dbe0f4',
                                                fontSize: '15px',
                                                marginBottom: '8px',
                                            }}
                                        >
                                            {t('monthly.updateButton')}
                                        </Button>
                                        <Button
                                            onClick={() => handleDeleteMonthly(item._id)}
                                            style={{
                                                backgroundColor: '#dbe0f4',
                                                fontSize: '15px',
                                                marginBottom: '8px',
                                            }}
                                        >
                                            {t('monthly.deleteButton')}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'manage' && (

                    <div className="table-responsive">
                        <table style={{width: '100%', borderCollapse: 'collapse'}}>
                            <thead>
                            <tr>
                                <th style={{padding: '8px'}}>{t('manage.id')}</th>
                                <th style={{padding: '8px'}}>{t('manage.startDate')}</th>
                                <th style={{padding: '8px'}}>{t('manage.endDate')}</th>
                                <th style={{padding: '8px'}}>{t('manage.status')}</th>
                                <th style={{padding: '8px'}}>{t('manage.action')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {ordersStatus.map((orderStatus, index) => (
                                <tr key={orderStatus.order_id?.$oid}>
                                    <td style={{padding: '8px'}}>{orderStatus.order_id?.$oid}</td>
                                    <td style={{padding: '8px'}}>{orderStatus.start_date}</td>
                                    <td style={{padding: '8px'}}>{orderStatus.end_date}</td>
                                    <td style={{padding: '8px'}}>{orderStatus.status}</td>
                                    <td style={{padding: '8px'}}>
                                        <Button
                                            onClick={() => handleUpdateOrderStatus(orderStatus.order_id?.$oid, 'Done')}
                                            style={{
                                                backgroundColor: '#b2f4c3',
                                                fontSize: '15px',
                                                marginRight: '8px',
                                                marginBottom: '8px',
                                            }}
                                        >
                                            {t('manage.doneButton')}
                                        </Button>
                                        <Button
                                            onClick={() => handleUpdateOrderStatus(orderStatus.order_id?.$oid, 'In the way')}
                                            style={{
                                                backgroundColor: '#f4f4c3',
                                                fontSize: '15px',
                                                marginRight: '8px',
                                                marginBottom: '8px',
                                            }}
                                        >
                                            {t('manage.inTheWayButton')}
                                        </Button>
                                        <Button
                                            onClick={() => handleUpdateOrderStatus(orderStatus.order_id?.$oid, 'In progress...')}
                                            style={{
                                                backgroundColor: '#f4c3c3',
                                                fontSize: '15px',
                                                marginBottom: '8px',
                                            }}
                                        >
                                            {t('manage.inProgressButton')}
                                        </Button>
                                        {index !== ordersStatus.length - 1 && <br/>} {/* Add line break between rows */}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPage;
