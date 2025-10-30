interface UserProfile {
    country: string,
    display_name: string,
    email: string,
    id: string,
    external_urls: string
    images: Image[],
    href: string,
    type: string,
    uri: string
}

type Image = {
    url: string,
    height: number,
    width: number,
}

