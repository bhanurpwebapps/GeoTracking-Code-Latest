export interface MenuItem {
    id?: number;
    label?: string;
    icon?: string;
    img?: string;
    link?: string;
    subItems?: any;
    isTitle?: boolean;
    badge?: any;
    parentId?: number;
    isLayout?: boolean;
    userType?:any;
}
