import { MockFunctionMetadata, ModuleMocker } from 'jest-mock'
import { ModuleMetadata } from '@nestjs/common'
import { Test } from '@nestjs/testing'

const moduleMocker = new ModuleMocker(global)

export const createTestingModule = (metadata: ModuleMetadata) =>
  Test.createTestingModule(metadata)
    .useMocker((token) => {
      if (typeof token === 'function') {
        const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>
        const Mock = moduleMocker.generateFromMetadata(mockMetadata)
        return new Mock()
      }
    })
    .compile()
