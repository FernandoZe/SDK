import { KOUNT_CREDENTIALS } from '../../../interfaces';

export class CreateScriptCommand {
  constructor(public readonly kountCredentials: KOUNT_CREDENTIALS) { }
}