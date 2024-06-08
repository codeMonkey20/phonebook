import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps, PhoneDirectory } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import graphql from "@/utils/graphql";
import useDebouncedState from "@/utils/useDebounceState";
import Skeleton from "@/Components/Skeleton";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import Modal from "@/Components/Modal";
import DangerButton from "@/Components/DangerButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { useState } from "react";

export default function Dashboard({ auth }: PageProps) {
    const [searchQuery, searchQueryDebounced, setSearchQuery] =
        useDebouncedState<string>("", 500);

    const [currentID, setCurrentID] = useState<number>(0);
    const [currentPhoneNumber, setCurrentPhoneNumber] = useState<string>("");
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isMutating, setIsMutating] = useState<boolean>(false);
    const [updatePhoneModalName, setUpdatePhoneModalName] =
        useState<string>("");
    const [updatePhoneModalNumber, setUpdatePhoneModalNumber] =
        useState<string>("");

    const phoneQuery = useQuery({
        queryKey: ["phone", searchQueryDebounced],
        queryFn: async () => {
            const graphqlResponse = await graphql(`
                {
                    search(search_query: "${searchQueryDebounced}") {
                        id
                        name
                        phone_number
                    }
                }
            `);

            const phone: PhoneDirectory[] | undefined =
                graphqlResponse.data?.search;

            return {
                phone,
                errors: graphqlResponse.errors ?? [],
            };
        },
        enabled: !!searchQueryDebounced,
    });

    const phoneMutation = useMutation({
        mutationKey: [
            "phoneupdate",
            updatePhoneModalName,
            updatePhoneModalNumber,
        ],
        mutationFn: async () => {
            const graphqlResponse = await graphql(`
                mutation {
                    updatePhoneDirectoryByID(
                        id: ${currentID}
                        name: "${updatePhoneModalName}"
                        ${
                            updatePhoneModalNumber !== currentPhoneNumber
                                ? `phone_number: "${updatePhoneModalNumber}"`
                                : ""
                        }
                    ) {
                        id
                        name
                        phone_number
                    }
                }
            `);
            if (graphqlResponse.errors?.length) {
                throw {
                    errors: graphqlResponse.errors,
                };
            } else {
                phoneQuery.refetch();
                closeModal();
                return graphqlResponse.data;
            }
        },
    });

    function closeModal() {
        setCurrentID(0);
        setIsEdit(false);
        setIsMutating(false);
        setCurrentPhoneNumber("");
        phoneMutation.reset();
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Search
                </h2>
            }
        >
            <Head title="Search" />
            <div className="px-4 py-12 sm:px-0">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-4 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="flex justify-center pt-2 pb-2">
                            <TextInput
                                id="search"
                                type="text"
                                placeholder="Search a phone number or a name"
                                className="w-96"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        {phoneQuery.isSuccess &&
                            phoneQuery.data?.phone &&
                            phoneQuery.data?.phone.map((phone, idx) => (
                                <div
                                    key={idx}
                                    className="flex justify-between p-4 mt-4 bg-white border rounded-lg shadow"
                                >
                                    <div>
                                        {!phoneQuery.isFetching ? (
                                            <p className="text-2xl font-semibold">
                                                {phone.phone_number}
                                            </p>
                                        ) : (
                                            <Skeleton className="w-32 mb-1 h-7" />
                                        )}
                                        {!phoneQuery.isFetching ? (
                                            <p className="text-lg">
                                                {phone.name}
                                            </p>
                                        ) : (
                                            <Skeleton className="w-24 h-7" />
                                        )}
                                    </div>
                                    <div className="flex items-center justify-center gap-2">
                                        <p
                                            className="text-lg cursor-pointer hover:underline"
                                            onClick={() => {
                                                setIsEdit(true);
                                                setCurrentID(phone.id);
                                                setUpdatePhoneModalName(
                                                    phone.name
                                                );
                                                setUpdatePhoneModalNumber(
                                                    phone.phone_number
                                                );
                                                setCurrentPhoneNumber(
                                                    phone.phone_number
                                                );
                                            }}
                                        >
                                            Edit
                                        </p>
                                        <p>|</p>
                                        <p
                                            className="text-lg cursor-pointer hover:underline"
                                            onClick={() =>
                                                setCurrentID(phone.id)
                                            }
                                        >
                                            Delete
                                        </p>
                                    </div>
                                </div>
                            ))}
                        {phoneQuery.isSuccess &&
                            phoneQuery.data?.phone?.length === 0 && (
                                <div className="px-2 py-4">
                                    <h3 className="text-xl font-semibold">
                                        No Results
                                    </h3>
                                </div>
                            )}
                        {phoneQuery.isLoading && (
                            <div className="flex flex-col gap-2 mt-4">
                                <Skeleton className="h-20" />
                                <Skeleton className="h-20" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Modal show={!!currentID && isEdit} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="text-xl font-semibold">Update Phone</h2>
                    <div className="flex flex-col gap-2 my-6">
                        <TextInput
                            type="text"
                            placeholder="Name"
                            value={updatePhoneModalName}
                            onChange={(e) =>
                                setUpdatePhoneModalName(e.target.value)
                            }
                        />
                        <TextInput
                            type="text"
                            placeholder="Phone Number"
                            value={updatePhoneModalNumber}
                            onChange={(e) =>
                                setUpdatePhoneModalNumber(e.target.value)
                            }
                        />
                        {phoneMutation.isError && (
                            <span className="text-sm text-red-500">
                                Phone Number is already taken
                            </span>
                        )}
                    </div>
                    <div className="flex justify-end gap-4">
                        <SecondaryButton onClick={closeModal}>
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton
                            onClick={() => phoneMutation.mutate()}
                            disabled={phoneMutation.isPending}
                        >
                            Update
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>
            <Modal
                show={!!currentID && !isEdit}
                onClose={closeModal}
                maxWidth="lg"
            >
                <div className="p-6">
                    <h2 className="mb-6 text-xl font-semibold">
                        Delete Phone?
                    </h2>
                    <div className="flex justify-end gap-4">
                        <SecondaryButton onClick={closeModal}>
                            Cancel
                        </SecondaryButton>
                        <DangerButton
                            onClick={() => {
                                setIsMutating(true);
                                graphql(`
                                    mutation {
                                        deletePhoneDirectory(id: ${currentID}) {
                                            id
                                            name
                                            phone_number
                                        }
                                    }
                                `)
                                    .then(() => phoneQuery.refetch())
                                    .finally(closeModal);
                            }}
                            disabled={isMutating}
                        >
                            Delete
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
