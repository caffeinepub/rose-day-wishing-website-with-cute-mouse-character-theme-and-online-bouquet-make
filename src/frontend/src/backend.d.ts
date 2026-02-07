import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Bouquet {
    id: bigint;
    ribbonStyle: string;
    cardMessage?: string;
    secret?: BouquetSecret;
    creatorName?: string;
    wrappingStyle: string;
    flowers: Array<Flower>;
}
export interface CoupleGif {
    id: bigint;
    url: string;
    name: string;
}
export interface Flower {
    color: string;
    quantity: bigint;
    flowerType: string;
}
export interface RoseDayWish {
    id: bigint;
    note?: string;
    bouquetId?: bigint;
    message: string;
    senderName: string;
    recipientName: string;
    gifUrl?: string;
}
export interface BouquetSecret {
    secretMessage?: string;
    secretImageUrl?: string;
    flowerType: string;
}
export interface backendInterface {
    addCoupleGif(name: string, url: string): Promise<bigint>;
    createBouquet(flowers: Array<Flower>, wrappingStyle: string, ribbonStyle: string, cardMessage: string | null, creatorName: string | null, secret: BouquetSecret | null): Promise<bigint>;
    createWish(senderName: string, recipientName: string, message: string, bouquetId: bigint | null, note: string | null, gifUrl: string | null): Promise<bigint>;
    editWish(id: bigint, senderName: string, recipientName: string, message: string, bouquetId: bigint | null, note: string | null, gifUrl: string | null): Promise<void>;
    filterCoupleGifsByName(substring: string): Promise<Array<CoupleGif>>;
    getAllBouquets(): Promise<Array<Bouquet>>;
    getAllCoupleGifs(): Promise<Array<CoupleGif>>;
    getAllWishes(): Promise<Array<RoseDayWish>>;
    getBouquet(id: bigint): Promise<Bouquet>;
    getCoupleGif(id: bigint): Promise<CoupleGif>;
    getWish(id: bigint): Promise<RoseDayWish>;
}
