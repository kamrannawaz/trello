"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { InputType, ReturnType } from "./types";
import { CopyList } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }

    const { id, boardId } = data;
    let list;

    try {
        const listToCopy = await db.list.findUnique({
            where:{
                id: id,
                boardId: boardId,
                board: {
                    orgId: orgId
                }
            },
            include: {
                cards: true
            }
        });

        if (!listToCopy) {
            return {
                error: "List not found."
            }
        }

        const lastList = await db.list.findFirst({
            where: {boardId: boardId},
            orderBy: {order: "desc"},
            select: {order: true}
        })

        const newOrder = lastList ? lastList.order + 1 : 0;

        list = await db.list.create({
            data: {
                title: `${listToCopy.title} - Copy`,
                order: newOrder,
                boardId: listToCopy.boardId,
                cards: {
                    createMany: {
                        data: listToCopy.cards.map(card => {
                            return {
                                title: card.title,
                                description: card.description,
                                order: card.order,
                            }
                        })
                    }
                }
            },
            include: {
                cards: true
            }
        })

    } catch (error) {
        return {
            error: "Failed to copy."
        }
    }

    revalidatePath(`/board/${boardId}`);
    return { data: list };
}

export const copyList = createSafeAction(CopyList, handler);