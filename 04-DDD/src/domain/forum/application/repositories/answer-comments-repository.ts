import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerComment } from '../../enterprise/entities/answer-comment'

export interface AnswersCommentsRepository {
  create(answer: AnswerComment): Promise<void>
  delete(answerComment: AnswerComment): Promise<void>
  
  findById(id: string): Promise<AnswerComment | null>

  findManyByAnswerId(questionId: string, params: PaginationParams): Promise<AnswerComment[]>
}
