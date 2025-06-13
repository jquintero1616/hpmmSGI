import React, { createContext, useEffect, useState } from 'react';
import {
    GetUnitsService,
    GetUnitByIdService,
    PostUnitService,
    PutUnitService,
    DeleteUnitService,
} from '../services/Units.service';

import { UnitContextType, ProviderProps } from '../interfaces/Context.interface';
import { UnitInterface } from '../interfaces/Units.interface';
import { useAuth } from '../hooks/use.Auth';
import useAxiosPrivate from '../hooks/axiosPrivateInstance';

export const UnitContext = createContext<UnitContextType>({
    units: [],
    GetUnitsContext: async () => [],
    GetUnitByIdContext: async () => undefined,
    PostCreateUnitContext: async () => { },
    PutUpdateUnitContext: async () => { },
    DeleteUnitContext: async () => { },
});

export const UnitProvider: React.FC<ProviderProps> = ({ children }) => {
    const [units, setUnits] = useState<UnitInterface[]>([]);
    const axiosPrivate = useAxiosPrivate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            GetUnitsContext()
                .then((data) => {
                    if (data !== null) {
                        setUnits(data);
                    } else {
                        console.error("Error al recuperar las unidades");
                    }
                })
                .catch((error) => {
                    console.error('Error al recuperar las unidades', error);
                });
        }
    }, [isAuthenticated]);

    const GetUnitsContext = async ():
     Promise<UnitInterface[] | null> => {
        try {
            const units = await GetUnitsService(axiosPrivate);
            if (units !== null) {
                setUnits(units);
            }
            return units;
        } catch (error) {
            console.error('Error al recuperar las unidades', error);
            return null;
        }
    };

    const GetUnitByIdContext = async (id_unit: string): Promise<UnitInterface | undefined> => {
        try {
            const unit = await GetUnitByIdService(axiosPrivate, id_unit);
            return unit;
        } catch (error) {
            console.error(`Error al recuperar la unidad con ID: ${id_unit}`, error);
            return undefined;
        }
    };

    const PostCreateUnitContext = async (unit: UnitInterface): Promise<UnitInterface> => {
        try {
            const newUnit = await PostUnitService(unit, axiosPrivate);
            setUnits((prevUnits) => [...prevUnits, newUnit]);
            return newUnit;
        } catch (error) {
            console.error('Error al crear la unidad', error);
            throw error;
        }
    };

    const PutUpdateUnitContext = async (
        id_unit: string, 
        unit: UnitInterface
    ): Promise<void> => {
        try {
            await PutUnitService(id_unit, unit, axiosPrivate);
            setUnits((prevUnits) =>
                prevUnits.map((u) => (u.id_units === id_unit ? unit : u))
            );
        } catch (error) {
            console.error(`Error al actualizar la unidad con ID: ${id_unit}`, error);
            throw error;
        }
    };

    const DeleteUnitContext = async (id_unit: string): Promise<void> => {
        try {
            await DeleteUnitService(id_unit, axiosPrivate);
            setUnits((prevUnits => prevUnits.filter((u) => u.id_units !== id_unit)));
        } catch (error) {
            console.error(`Error al eliminar la unidad con ID: ${id_unit}`, error);
            throw error;
        }
    }
    return (
        <UnitContext.Provider
            value={{
                units,
                GetUnitsContext,
                GetUnitByIdContext,
                PostCreateUnitContext,
                PutUpdateUnitContext,
                DeleteUnitContext,
            }}
        >
            {children}
        </UnitContext.Provider>
    );
}