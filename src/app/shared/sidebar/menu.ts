import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
   
    // Product Admin Links
    {
        id: 1,
        label: 'Dashboard Admin',
        img:"assets/images/dashboard-icon.svg",
        link: 'dashboard-productadmin',
        userType:['AppProvider']
    },

    {
        id: 2,
        label: 'Schools',
        img:"assets/images//students-icon.svg",
        link: 'clients',
        userType:['AppProvider']
    },
    // Product Admin Links End


   // Clients Admin Links
        {
            id: 21,
            label: 'Dashboard',
            img:"assets/images/dashboard-icon.svg",
            link: 'dashboard-client',
            userType:['ClientUser']
        },

        {
            id: 22,
            label: 'Users',
            img:"assets/images/users-icon.svg",
            link: 'users',
            userType:['ClientUser']
        },

        {
            id: 23,
            label: 'ClassRoom & Areas',
            img:"assets/images/areas-icon.svg",
            link: 'areas',
            userType:['ClientUser']
        },

        {
            id: 24,
            label: 'Gateways',
            img:"assets/images/gateway-icon.svg",
            link: 'gateways',
            userType:['ClientUser']
        },

        // {
        //     id: 25,
        //     label: 'Badges',
        //     img:"assets/images/badges-icon.svg",
        //     link: 'badges',
        //     userType:['ClientUser']
        // },

        {
            id: 26,
            label: 'Students',
            img:"assets/images/students-icon.svg",
            link: 'students',
            userType:['ClientUser']
        },

        {
            id: 27,
            label: 'Attendance',
            img:"assets/images/attendance-icon.svg",
            link: 'attendance',
            userType:['ClientUser']
        },

 
];
