/****** Object:  Table [dbo].[Donations]    Script Date: 25-09-2025 01:20:59 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Donations](
	[donation_id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NOT NULL,
	[donated_amount] [int] NULL,
	[receipt_no] [nvarchar](50) NULL,
	[pay_date] [datetime2](7) NULL,
	[pay_mode] [nvarchar](50) NULL,
	[transaction_no] [nvarchar](100) NULL,
	[created_by] [nvarchar](100) NOT NULL,
	[created_on] [datetime2](7) NOT NULL,
	[modified_by] [nvarchar](100) NULL,
	[modified_on] [datetime2](7) NULL,
	[payment_status] [bit] NOT NULL,
	[receipt_type] [varchar](5) NULL,
 CONSTRAINT [PK_Donations] PRIMARY KEY CLUSTERED 
(
	[donation_id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 25-09-2025 01:20:59 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[user_id] [int] IDENTITY(1,1) NOT NULL,
	[name_en] [nvarchar](200) NOT NULL,
	[name_kn] [nvarchar](200) NOT NULL,
	[place] [nvarchar](200) NULL,
	[contact_no] [nvarchar](20) NULL,
	[pledge_amount] [int] NULL,
	[created_by] [nvarchar](100) NOT NULL,
	[created_on] [datetime2](7) NOT NULL,
	[modified_by] [nvarchar](100) NULL,
	[modified_on] [datetime2](7) NULL,
	[user_type] [varchar](5) NULL,
 CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED 
(
	[user_id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Donations] ADD  CONSTRAINT [DF_Donations_CreatedOn]  DEFAULT (sysutcdatetime()) FOR [created_on]
GO
ALTER TABLE [dbo].[Users] ADD  CONSTRAINT [DF_Users_CreatedOn]  DEFAULT (sysutcdatetime()) FOR [created_on]
GO
ALTER TABLE [dbo].[Donations]  WITH CHECK ADD  CONSTRAINT [FK_Donations_Users] FOREIGN KEY([user_id])
REFERENCES [dbo].[Users] ([user_id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Donations] CHECK CONSTRAINT [FK_Donations_Users]
GO
