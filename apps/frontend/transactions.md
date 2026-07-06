> ## Documentation Index
> Fetch the complete documentation index at: https://developer.nomba.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Fetch transactions on a sub account

> You can use this endpoint to fetch transactions on a sub account.



## OpenAPI

````yaml get /v1/transactions/accounts/{subAccountId}
openapi: 3.0.1
info:
  description: ''
  title: Vendor API
  version: 1.0.0
servers:
  - description: Production
    url: https://api.nomba.com
  - description: Sandbox
    url: https://sandbox.nomba.com
security: []
tags:
  - name: Authenticate
  - name: Accounts
  - name: Virtual Accounts
  - name: Online Checkout
  - name: Charge
  - name: Transfers
  - name: Direct Debits
  - name: Terminals
  - name: Transactions
  - name: Airtime and Data Vending
  - name: Electricity Vending
  - name: CableTV Subscription
  - name: Betting Vending
paths:
  /v1/transactions/accounts/{subAccountId}:
    get:
      tags:
        - Transactions
      summary: Fetch transactions on a sub account
      description: You can use this endpoint to fetch transactions on a sub account.
      operationId: Fetch transactions on a sub account
      parameters:
        - description: The parent accountId of the business.
          in: header
          name: accountId
          schema:
            type: string
            format: uuid
            example: 890022ce-bae0-45c1-9b9d-ee7872e6ca27
          required: true
        - description: The sub accountId of the business.
          example: 2242b79d-f2cf-4ccc-ada1-e890bd1a9f0d
          in: path
          name: subAccountId
          required: true
          schema:
            type: string
        - description: >-
            This endpoint is paginated. `limit` describes the size of the page
            you are querying
          example: 10
          in: query
          name: limit
          schema:
            type: integer
            format: int32
          required: false
        - description: >-
            The `cursor` is used to scroll to the next page. When making the
            first call to list all accounts, there is no need to pass in any
            cursor since the API has not returned any cursor back to you. Only
            use cursor when the API provides it
          example: xchbaVFsjdsbaADddd
          in: query
          name: cursor
          schema:
            type: string
          required: false
        - description: 'This starting date (UTC). Sample date: `2023-01-01T00:00:00`'
          in: query
          name: dateFrom
          example: '2023-09-08T00:00:00.007Z'
          schema:
            type: string
          required: false
        - description: 'This ending date (UTC). Sample date: `2024-09-30T23:59:59`'
          in: query
          name: dateTo
          example: '2023-08-08T23:59:59.007Z'
          schema:
            type: string
          required: false
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  code:
                    type: string
                    example: '00'
                    description: Response Code
                  description:
                    type: string
                    example: Success
                    description: Response description
                  data:
                    $ref: '#/components/schemas/TransactionListResults'
                required:
                  - code
                  - description
                  - data
          description: OK - your request was successful.
          headers:
            X-Rate-Limit-Limit:
              description: The number of allowed requests in the current period
              schema:
                type: string
                example: '40'
            X-Rate-Limit-Remaining:
              description: The number of remaining requests in the current period
              schema:
                type: string
                example: '39'
            X-Rate-Limit-Window:
              description: The specified rate limit window
              schema:
                type: string
                example: 1s
        '400':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/RequestError'
          description: The request body sent by merchant did not pass the validation checks
        '401':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthenticationError'
          description: >-
            The access_token provided to access the resource is missing or
            invalid.
        '403':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthorizationError'
          description: The client does not have the permissions to access this resource
        '404':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/RecordNotFoundError'
          description: The record that the client is trying to access does not exist.
        '429':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/RateLimitError'
          description: >-
            The client has maxed out the number of calls within a time period on
            this resource.
        '500':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ServerError'
          description: Downstream system error.
      security:
        - BearerAuth: []
components:
  schemas:
    TransactionListResults:
      type: object
      properties:
        results:
          type: array
          description: Contains list of transactions
          items:
            $ref: '#/components/schemas/TransactionResult'
        cursor:
          type: string
          description: >-
            Cursor for pagination. It will be empty if there is no more page to
            scroll to
          example: xchbaVFsjdsbaADddd
    RequestError:
      type: object
      description: Request Error response.
      properties:
        code:
          type: string
          description: API error code.
          example: '400'
        description:
          type: string
          description: Additional details about the error.
          example: Request failed.
    AuthenticationError:
      type: object
      description: Authentication Error response.
      properties:
        code:
          type: string
          description: API error code.
          example: '401'
        description:
          type: string
          description: Additional details about the error.
          example: Unauthorized
    AuthorizationError:
      type: object
      description: Permissions error response.
      properties:
        code:
          type: string
          description: API error code.
          example: '403'
        description:
          type: string
          description: Additional details about the error.
          example: Forbidden
    RecordNotFoundError:
      type: object
      description: Record-Not-Found error response.
      properties:
        code:
          type: string
          description: API error code.
          example: '404'
        description:
          type: string
          description: Additional details about the error.
          example: Record not found
    RateLimitError:
      type: object
      description: Rate-limit error response.
      properties:
        code:
          type: string
          description: API error code.
          example: '429'
        description:
          type: string
          description: Additional details about the error.
          example: Too many requests
    ServerError:
      type: object
      description: Server error response.
      properties:
        code:
          type: string
          description: API error code.
          example: '500'
        description:
          type: string
          description: Additional details about the error.
          example: Server error
    TransactionResult:
      type: object
      properties:
        id:
          type: string
          description: Transaction ID
          example: POS-WITHDRAW-DFC05-693cd007-cd1e-4ea6-8b79-5f5c4d7a83ea
        status:
          type: string
          description: |-
            Transaction status. 
             `SUCCESS` means the transaction was successful. 
             `REFUND` means the transaction failed and has been refunded to your account. 
             `PENDING_BILLING`, `CANCELLED`, `PAYMENT_FAILED`, and `REVERSED_BY_VENDOR` mean the transaction is pending.
          enum:
            - SUCCESS
            - PENDING_BILLING
            - REFUND
            - CANCELLED
            - PAYMENT_FAILED
            - REVERSED_BY_VENDOR
          example: SUCCESS
        amount:
          type: number
          format: double
          description: Transaction amount
          example: 4000
        fixedCharge:
          type: number
          format: double
          description: Fixed charge
          example: 0
        source:
          type: string
          description: Transaction source
          enum:
            - api
            - pos
            - web
            - android_app
            - ios_app
          example: pos
        type:
          type: string
          description: Transaction type
          enum:
            - withdrawal
            - purchase
            - transfer
            - p2p
            - online_checkout
            - qrt_credit
            - qrt_debit
          example: withdrawal
        gatewayMessage:
          type: string
          description: Gateway message
          example: SUCCESS
        customerBillerId:
          type: string
          description: Customer biller ID
          example: 539983 **** **** 5118
        timeCreated:
          type: string
          format: date-time
          description: Creation timestamp
          example: '2026-03-08T19:26:34.657000Z'
        posTid:
          type: string
          description: POS terminal ID
          example: 2KUD4AKB
        terminalId:
          type: string
          description: Terminal ID
          example: 2KUD4AKB
        providerTerminalId:
          type: string
          description: Provider terminal ID
          example: 2KUD4AKB
        rrn:
          type: string
          description: RRN (Retrieval Reference Number)
          example: '230908202632'
        posSerialNumber:
          type: string
          description: POS serial number
          example: '91230309116826'
        posTerminalLabel:
          type: string
          description: POS terminal label
          example: KEB MUSA ABUBAKAR
        stan:
          type: string
          description: STAN (System Trace Audit Number)
          example: '556734'
        paymentVendorReference:
          type: string
          description: Payment vendor reference
          example: 2KUD4AKB230908202632
        userId:
          type: string
          description: User ID
          example: dfc05ca1-4e75-41dd-8e41-2d362d565893
        posRrn:
          type: string
          description: POS RRN (Retrieval Reference Number)
          example: '230908202632'
        merchantTxRef:
          type: string
          description: Merchant transaction reference
          example: c90d-4b25-ad0f
      required:
        - id
        - status
        - amount
        - source
        - type
        - gatewayMessage
        - timeCreated
  securitySchemes:
    BearerAuth:
      description: >-
        Nomba authenticates API calls with [OAuth2 HTTP bearer
        tokens](http://tools.ietf.org/html/rfc6750). There are two methods of
        authentication; [Client-Credentials
        method](https://www.rfc-editor.org/rfc/rfc6749) and [PKCE (Proof Key for
        Code Exchange)](https://www.rfc-editor.org/rfc/rfc7636) method. In each
        of the methods, You will get an `ACCESS_TOKEN`. You need to use an
        `"Authorization"` HTTP header to provide your `ACCESS_TOKEN`. For
        example: `Authorization: {ACCESS_TOKEN}`.
      scheme: bearer
      type: http
      bearerFormat: JWT

````