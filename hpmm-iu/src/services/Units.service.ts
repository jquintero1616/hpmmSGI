import {AxiosInstance} from 'axios';
import {UnitInterface} from '../interfaces/Units.interface';

export const GetUnitsService = async ( useAxiosPrivate: AxiosInstance ):
Promise<UnitInterface[] | null> => {
    try {
        const response = await useAxiosPrivate.get('/units');
        return response.data.units;
    } catch (error) {
        console.error('Error fetching units:', error);
        return null;
    }
    };

export const GetUnitByIdService = async ( 
    useAxiosPrivate: AxiosInstance, 
    id_units: string 
): Promise<UnitInterface | undefined> => {
    try {
        const response = await useAxiosPrivate.get(
            `/units/${id_units}`);
        return response.data.units;
    } catch (error) {
        console.error(`Error fetching unit with ID: ${id_units}`, error);
        return undefined;
    }
};
export const PostUnitService = async (
    units: UnitInterface,
    AxiosPrivate: AxiosInstance
): Promise<UnitInterface> => {
    const response = await AxiosPrivate.post(
        `/units`,
        {
            id_subdireccion: units.id_subdireccion,
            id_units: units.id_units,
            name: units.name,
            estado: units.estado,
        },
        {headers: {'Content-Type': 'application/json'}}
    );
    return response.data.units; 
}

export const PutUnitService = async (
    id_units: string,
    units: UnitInterface,
    AxiosPrivate: AxiosInstance
): Promise<UnitInterface> => {
    const response = await AxiosPrivate.put(
        `/units/${id_units}`,
        {
            id_subdireccion: units.id_subdireccion,
            id_units: units.id_units,
            name: units.name,
            estado: units.estado,
        },
        {headers: {'Content-Type': 'application/json'}}
    );
    return response.data.units; 
}

export const DeleteUnitService = async (
    id_units: string,
    AxiosPrivate: AxiosInstance
): Promise<void> => {
    await AxiosPrivate.delete(`/units/${id_units}`);
};