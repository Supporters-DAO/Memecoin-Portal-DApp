'use client'

import { atom, useAtom } from 'jotai'
import React from 'react'
import { CreateForm } from './form'
import { ConfirmCreate } from './confirm'
import { ICreateTokenForm } from './schema'

type StepType = 'create' | 'confirm'
export const stepAtom = atom<StepType>('create')

export const dataTokenAtom = atom<ICreateTokenForm | undefined>(undefined)

export const CreateToken = () => {
	const [step] = useAtom(stepAtom)
	const [dataToken] = useAtom(dataTokenAtom)

	return step === 'create' ? <CreateForm /> : <ConfirmCreate data={dataToken} />
}
