import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps, PaginatorInfo, PhoneDirectory } from "@/types";
import { useQuery } from "@tanstack/react-query";
import graphql from "@/utils/graphql";
import Skeleton from "@/Components/Skeleton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import { useState } from "react";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";

export default function Phones({ auth }: PageProps) {
    const [page, setPage] = useState<number>(1);
    const [addPhoneModalOpen, setAddPhoneModalOpen] = useState<boolean>(false);
    const [isMutating, setIsMutating] = useState<boolean>(false);
    const [addPhoneModalName, setAddPhoneModalName] = useState<string>("");
    const [addPhoneModalNumber, setAddPhoneModalNumber] = useState<string>("");

    function closeModal() {
        setAddPhoneModalOpen(false);
        setIsMutating(false);
    }

    const phonesQuery = useQuery({
        queryKey: ["phones", page],
        queryFn: async () => {
            const graphqlResponse = await graphql(`
                {
                    phones(page: ${page}, first: 5) {
                        data {
                            id
                            name
                            phone_number
                            created_at
                        }
                        paginatorInfo {
                            count
                            currentPage
                            hasMorePages
                            total
                            perPage
                            firstItem
                            lastItem
                            lastPage
                        }
                    }
                }
            `);

            const phones: PhoneDirectory[] = graphqlResponse.data?.phones?.data;

            const paginatorInfo: PaginatorInfo =
                graphqlResponse.data?.phones?.paginatorInfo;

            return {
                phones,
                errors: graphqlResponse.errors ?? [],
                paginatorInfo,
            };
        },
    });

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Phone Directory
                </h2>
            }
        >
            <Head title="Phone Directory" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-4 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <PrimaryButton
                            className="mb-4"
                            onClick={() => setAddPhoneModalOpen(true)}
                        >
                            Add Phone Number
                        </PrimaryButton>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="w-1/2 px-2 py-1 border">
                                        Name
                                    </th>
                                    <th className="px-2 py-1 border">
                                        Phone Number
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {phonesQuery.isSuccess &&
                                    phonesQuery.data.phones?.map(
                                        (phone, idx) => (
                                            <tr
                                                key={phone.id}
                                                className={
                                                    idx % 2 === 0
                                                        ? ""
                                                        : "bg-gray-100"
                                                }
                                            >
                                                <td className="px-2 py-1 border">
                                                    {phone.name}
                                                </td>
                                                <td className="px-2 py-1 border">
                                                    {phone.phone_number}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                {phonesQuery.isLoading && (
                                    <>
                                        <tr>
                                            <td className="px-2 py-1 border">
                                                <Skeleton />
                                            </td>
                                            <td className="px-2 py-1 border">
                                                <Skeleton />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-2 py-1 border">
                                                <Skeleton />
                                            </td>
                                            <td className="px-2 py-1 border">
                                                <Skeleton />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-2 py-1 border">
                                                <Skeleton />
                                            </td>
                                            <td className="px-2 py-1 border">
                                                <Skeleton />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-2 py-1 border">
                                                <Skeleton />
                                            </td>
                                            <td className="px-2 py-1 border">
                                                <Skeleton />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-2 py-1 border">
                                                <Skeleton />
                                            </td>
                                            <td className="px-2 py-1 border">
                                                <Skeleton />
                                            </td>
                                        </tr>
                                    </>
                                )}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td
                                        colSpan={2}
                                        className="px-2 py-4 text-center"
                                    >
                                        <SecondaryButton
                                            onClick={() =>
                                                setPage((state) => --state)
                                            }
                                            disabled={page <= 1}
                                        >
                                            Prev
                                        </SecondaryButton>
                                        <span className="mx-4">{page}</span>
                                        <SecondaryButton
                                            onClick={() =>
                                                setPage((state) => ++state)
                                            }
                                            disabled={
                                                !phonesQuery.data?.paginatorInfo
                                                    .hasMorePages
                                            }
                                        >
                                            Next
                                        </SecondaryButton>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
            <Modal show={addPhoneModalOpen} onClose={closeModal} maxWidth="lg">
                <div className="p-6">
                    <h2 className="text-xl font-semibold">Add Phone</h2>
                    <div className="flex flex-col gap-2 my-6">
                        <TextInput
                            type="text"
                            placeholder="Name"
                            value={addPhoneModalName}
                            onChange={(e) =>
                                setAddPhoneModalName(e.target.value)
                            }
                        />
                        <TextInput
                            type="text"
                            placeholder="Phone Number"
                            value={addPhoneModalNumber}
                            onChange={(e) =>
                                setAddPhoneModalNumber(e.target.value)
                            }
                        />
                    </div>
                    <div className="flex justify-end gap-4">
                        <SecondaryButton onClick={closeModal}>
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton
                            onClick={() => {
                                setIsMutating(true);
                                graphql(`
                                    mutation {
                                        createPhoneDirectory(
                                            name: "${addPhoneModalName}"
                                            phone_number: "${addPhoneModalNumber}"
                                        ) {
                                            id
                                            name
                                            phone_number
                                        }
                                    }
                                `)
                                    .then(() => phonesQuery.refetch())
                                    .finally(closeModal);
                            }}
                            disabled={isMutating}
                        >
                            Add Phone
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
